using Azure.Storage.Blobs;
using Microsoft.Extensions.Options;
using Volware.Common;

namespace Volware.DAL.Repositories
{
    public class StorageRepository
    {
        private readonly StorageOptions _storageOptions;

        public StorageRepository(IOptions<StorageOptions> storageOptions)
        {
            _storageOptions = storageOptions.Value;
        }

        public BlobClient CreateBlobEntity(string blobName)
        {
            BlobServiceClient client = new BlobServiceClient(_storageOptions.ConnectionString);

            var guidFileName = Guid.NewGuid().ToString("n");

            var container = client.GetBlobContainerClient("volware");
            var blobClient = container.GetBlobClient(blobName ?? guidFileName);
            return blobClient;
        }

        public Stream GetBlob(string blobName)
        {
            BlobServiceClient client = new BlobServiceClient(_storageOptions.ConnectionString);

            var container = client.GetBlobContainerClient("volware");
            var blobClient = container.GetBlobClient(blobName);

            var stream = blobClient.DownloadStreaming().Value.Content;

            return stream;
        }
    }
}
