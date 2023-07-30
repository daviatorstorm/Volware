using Microsoft.EntityFrameworkCore;
using Volware.Common;
using Volware.Common.Exceptions;
using Volware.Common.Filtering;
using Volware.DAL.Models;

namespace Volware.DAL.Repositories
{
    public class ActionLogRepository : BaseRepository<ActionLog>
    {
        private readonly UserRepository _userRepository;

        public ActionLogRepository(UserRepository userRepository, VolwareDBContext context)
            : base(context)
        {
            _userRepository = userRepository;
        }

        public async Task<FilterResult<ActionLog>> GetFiltered(ActionLogFilterParams filterParams, int warehouseId, string externalUserId)
        {
            var user = await _userRepository.GetById(externalUserId);
            var filteredEntities = Entities
                .Where(x => x.WarehouseId == warehouseId && x.InitiatorId == user.Id);

            var filteredActionLogs = await filteredEntities
                    .Paginate(filterParams)
                    .OrderByDescending(x => x.DateCreated)
                    .ToListAsync();

            var userIds = filteredActionLogs.GroupBy(x => x.ExternalUserId).Select(x => x.Key);

            var internalUsers = await _userRepository.GetByIds(userIds);

            return new FilterResult<ActionLog>
            {
                Results = filteredActionLogs.Select(x => new ActionLog
                {
                    ActionType = x.ActionType,
                    EntityId = x.EntityId,
                    Initiator = internalUsers.FirstOrDefault(u => u.ExternalId == x.ExternalUserId)
                }).ToList(),
                Total = await filteredEntities.CountAsync()
            };
        }

        public async Task<FilterResult<ActionLog>> GetFiltered(ActionLogFilterParams filterParams, int warehouseId)
        {
            var filteredEntities = Entities
                .Where(x => x.WarehouseId == warehouseId);

            var filteredUsers = await filteredEntities
                   .Paginate(filterParams)
                   .OrderByDescending(x => x.DateCreated)
                   .ToListAsync();

            var userIds = filteredUsers.GroupBy(x => x.ExternalUserId).Select(x => x.Key);

            var internalUsers = await _userRepository.GetByIds(userIds);

            return new FilterResult<ActionLog>
            {
                Results = filteredUsers.Select(x => new ActionLog
                {
                    ActionType = x.ActionType,
                    EntityId = x.EntityId,
                    Initiator = internalUsers.FirstOrDefault(u => u.ExternalId == x.ExternalUserId)
                }).ToList(),
                Total = await filteredEntities.CountAsync()
            };
        }

        public async Task<ActionLog> Add(string message, ActionTypeEnum actionType, int userId, int warehouseId)
        {
            var user = await Context.TempUsers.FirstOrDefaultAsync(x => x.Id == userId);
            if (user == null)
            {
                throw new VolwareNotFoundException(userId, typeof(TempUser));
            }

            var entity = (await Context.ActionLogs.AddAsync(new ActionLog
            {
                InitiatorId = userId,
                ExternalUserId = user.ExternalId,
                WarehouseId = warehouseId,
                ActionType = actionType,
                Message = message
            })).Entity;

            await SaveChangesAsync();

            return entity;
        }

        public async Task<ActionLog> Add(int entityId, ActionTypeEnum actionType, int userId, int warehouseId)
        {
            var user = await Context.TempUsers.FirstOrDefaultAsync(x => x.Id == userId);
            if (user == null)
            {
                throw new VolwareNotFoundException(userId, typeof(TempUser));
            }

            var entity = (await Context.ActionLogs.AddAsync(new ActionLog
            {
                InitiatorId = userId,
                ExternalUserId = user.ExternalId,
                WarehouseId = warehouseId,
                ActionType = actionType,
                EntityId = entityId
            })).Entity;

            await SaveChangesAsync();

            return entity;
        }
    }
}
