using System.Runtime.Serialization;

namespace Volware.Common.Exceptions
{
    public class VolwareBadRequest : Exception
    {
        public VolwareBadRequest()
        {
        }

        public VolwareBadRequest(Dictionary<string, string> errors)
        {
            foreach (var kvp in errors)
            {
                Data.Add(kvp.Key, kvp.Value);
            }
        }

        public VolwareBadRequest(string message) 
            : base(message)
        {
            Data.Add("Error", message);
        }

        public VolwareBadRequest(string message, Exception innerException) 
            : base(message, innerException)
        {
            Data.Add("Error", message);
        }

        protected VolwareBadRequest(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}