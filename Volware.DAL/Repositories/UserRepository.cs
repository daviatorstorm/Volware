using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using QRCoder;
using Volware.BackgroundWorker;
using Volware.Common;
using Volware.Common.Exceptions;
using Volware.Common.Filtering;
using Volware.DAL.Models;

namespace Volware.DAL.Repositories
{
    public class UserRepository : BaseRepository<TempUser>
    {
        private readonly IBackgroundQueue _backgroundQueue;
        private readonly StorageRepository _storageService;

        public UserRepository(IBackgroundQueue backgroundQueue,
            StorageRepository storageService, VolwareDBContext context)
            : base(context)
        {
            _backgroundQueue = backgroundQueue;
            _storageService = storageService;
        }

        private IQueryable<TempUser> AllUserIncludes()
        {
            return Context.TempUsers.Select(u =>
                new TempUser
                {
                    Id = u.Id,
                    CreatedBy = u.CreatedBy,
                    CreatedById = u.CreatedById,
                    Documents = Context.Files.Where(f => f.EntityId == u.Id && f.Entity == VolwareFileEntityEnum.UserDocuments).ToList(),
                    ProfileImage = Context.Files.FirstOrDefault(f => f.Id == u.ProfileImageId && f.Entity == VolwareFileEntityEnum.UserProfile),
                    ProfileImageId = u.ProfileImageId,
                    ExternalId = u.ExternalId,
                    LastUpdated = u.LastUpdated,
                    Role = u.Role,
                    UserInfo = Context.UserInfos.FirstOrDefault(ui => ui.UserId == u.Id),
                    WarehouseId = u.WarehouseId
                }
            );
        }

        public new async Task<TempUser> GetById(int id)
        {
            var internalUser = await AllUserIncludes().FirstOrDefaultAsync(x => x.Id == id);
            if (internalUser == null)
            {
                throw new VolwareNotFoundException(id, typeof(TempUser));
            }

            return internalUser;
        }

        public async Task<IEnumerable<TempUser>> GetUsersByRole(FilterParams filterParams, UserRoleEnum userRole)
        {
            return await Entities.Include(x => x.UserInfo)
                .Where(x => x.Role == userRole)
                .ToListAsync();
        }

        public async Task<TempUser> GetProfile(string externalUserId, int warehouseId)
        {
            var internalUser = await GetById(externalUserId);

            if (internalUser == null)
            {
                throw new VolwareNotFoundException(externalUserId, typeof(TempUser));
            }

            return internalUser;
        }

        public async Task<byte[]> GetQRCode(string externalUserId)
        {
            UserQR userQR = await Context.UserQRs.FirstOrDefaultAsync(x => x.ExternalUserId == externalUserId);
            if (userQR != null)
            {
                if (userQR.ValidTo <= DateTime.UtcNow)
                {
                    Context.UserQRs.Remove(userQR);
                    await SaveChangesAsync();
                }
                else
                {
                    return GenerateQR(userQR.Seed);
                }
            }

            var internalUser = await Context.TempUsers.FirstOrDefaultAsync(x => x.ExternalId == externalUserId);
            string inputData = $"{Guid.NewGuid().ToString("n")};{externalUserId}";
            Context.UserQRs.Add(new UserQR
            {
                ExternalUserId = externalUserId,
                UserId = internalUser.Id,
                IssuedAt = DateTime.UtcNow,
                ValidTo = DateTime.UtcNow.AddMinutes(15),
                Seed = inputData
            });
            await SaveChangesAsync();

            return GenerateQR(inputData);
        }

        public async Task<List<TempUser>> GetFilteredUsers(FilterParams filter, int warehouseId)
        {
            var entities = Entities.Include(x => x.UserInfo)
                .Where(x => x.WarehouseId == warehouseId);

            if (!string.IsNullOrWhiteSpace(filter.Q))
            {
                var lowerQ = filter.Q.ToLower();
                entities = entities
                    .Where(x => EF.Functions.Like(x.UserInfo.FirstName.ToLower(), $"%{lowerQ}%") ||
                        EF.Functions.Like(x.UserInfo.LastName.ToLower(), $"%{lowerQ}%") ||
                        EF.Functions.Like(x.UserInfo.ThirdName.ToLower(), $"%{lowerQ}%"));
            }

            return (await entities.Paginate(filter)
                .ToListAsync())
                .ToList();
        }

        public async Task<IEnumerable<TempUser>> GetByIds(IEnumerable<string> userIds)
        {
            return await Entities
                .Include(x => x.UserInfo)
                .Where(x => userIds.Contains(x.ExternalId))
                .ToListAsync();
        }

        public async Task<TempUser> GetUserByQR(string qrCode, int warehouseId)
        {
            var userQR = await Context.UserQRs.FirstOrDefaultAsync(x => x.Seed == qrCode &&
                x.User.WarehouseId == warehouseId);
            if (userQR == null)
            {
                throw new VolwareNotFoundException(qrCode, typeof(UserQR));
            }

            if (userQR.ValidTo <= DateTime.UtcNow)
            {
                Context.UserQRs.Remove(userQR);
                await SaveChangesAsync();

                throw new VolwareBadRequest(new Dictionary<string, string>());
            }

            var internalUser = await Context.TempUsers
                .Include(x => x.UserInfo)
                .Include(x => x.ProfileImage)
                .Include(x => x.Documents).FirstOrDefaultAsync(x => x.ExternalId == userQR.ExternalUserId);

            return internalUser;
        }

        public async Task<TempUser> GetById(string externalId)
        {
            return await AllUserIncludes()
                .FirstOrDefaultAsync(x => x.ExternalId == externalId);
        }

        public async Task<TempUser> Add(TempUser userCreate, IFormFile profilePhoto, IFormFileCollection documentPhotos,
            string externalUserId, int warehouseId)
        {
            // TODO: Return here

            BlobClient blobClient = _storageService.CreateBlobEntity(null);
            await blobClient.UploadAsync(profilePhoto.OpenReadStream());
            var userProfilePhoto = blobClient.Name;
            var userDocumentPhotos = new List<string>();

            foreach (var document in documentPhotos)
            {
                BlobClient localClient = _storageService.CreateBlobEntity(null);
                await localClient.UploadAsync(document.OpenReadStream());
                userDocumentPhotos.Add(localClient.Name);
            }

            // TODO: Return here
            TempUser user = new TempUser();

            var currentUser = await GetById(externalUserId);

            userCreate.CreatedById = currentUser.Id;
            userCreate.WarehouseId = warehouseId;
            //userCreate.ExternalId = newUser.Id;

            var internalUser = (await Entities.AddAsync(userCreate)).Entity;

            await SaveChangesAsync();

            var profileImage = (Context.Files.Add(new VolwareFile
            {
                FileName = userProfilePhoto,
                EntityId = internalUser.Id,
                Entity = VolwareFileEntityEnum.UserProfile
            })).Entity;

            Context.Files.AddRange(userDocumentPhotos.Select(d => new VolwareFile
            {
                FileName = d,
                EntityId = internalUser.Id,
                Entity = VolwareFileEntityEnum.UserDocuments
            }));

            await SaveChangesAsync();

            internalUser.ProfileImageId = profileImage.Id;

            await SaveChangesAsync();

            _backgroundQueue.QueueBackgroundWorkItemAsync(async (services, ct) =>
            {
                await services.GetRequiredService<ActionLogRepository>().Add(
                    internalUser.Id, ActionTypeEnum.AddUser, currentUser.Id, warehouseId);
            });

            return internalUser;
        }

        public async Task<TempUser> Add(TempUser userCreate, IFormFile profilePhoto, IFormFileCollection documentPhotos)
        {
            // TODO: Return here

            BlobClient blobClient = _storageService.CreateBlobEntity(null);
            await blobClient.UploadAsync(profilePhoto.OpenReadStream());
            var userProfilePhoto = blobClient.Name;
            var userDocumentPhotos = new List<string>();
            foreach (var document in documentPhotos)
            {
                BlobClient localClient = _storageService.CreateBlobEntity(null);
                await localClient.UploadAsync(document.OpenReadStream());
                userDocumentPhotos.Add(localClient.Name);
            }

            //userCreate.ExternalId = newUser.Id;

            var internalUser = (await Entities.AddAsync(userCreate)).Entity;

            await SaveChangesAsync();

            var profileImage = (Context.Files.Add(new VolwareFile
            {
                FileName = userProfilePhoto,
                EntityId = internalUser.Id,
                Entity = VolwareFileEntityEnum.UserProfile
            })).Entity;

            Context.Files.AddRange(userDocumentPhotos.Select(d => new VolwareFile
            {
                FileName = d,
                EntityId = internalUser.Id,
                Entity = VolwareFileEntityEnum.UserDocuments
            }));

            await SaveChangesAsync();

            internalUser.ProfileImageId = profileImage.Id;

            await SaveChangesAsync();

            return internalUser;
        }

        private byte[] GenerateQR(string inputData)
        {
            QRCodeData qRCodeData = QRCodeGenerator.GenerateQrCode(inputData, QRCodeGenerator.ECCLevel.Q);
            return new QRCoder.PngByteQRCode(qRCodeData).GetGraphic(10);
        }
    }
}
