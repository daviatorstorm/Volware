using Microsoft.AspNetCore.Mvc;
using Volware.DAL.Repositories;

namespace Volware.Api.Controllers
{
    public class StorageController : BaseController
    {
        private readonly StorageRepository _storageService;

        public StorageController(StorageRepository storageService, ILoggerFactory loggerFactory) 
            : base(loggerFactory)
        {
            _storageService = storageService;
        }

        [HttpGet("{blobName}")]
        public Stream GetBlob(string blobName)
        {
            Stream stream = _storageService.GetBlob(blobName);

            return stream;
        }
    }
}
