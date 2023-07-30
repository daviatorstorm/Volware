namespace Volware.Common.Exceptions
{
    public class VolwareNotFoundException : Exception
    {
        private readonly string _message;

        public VolwareNotFoundException()
        {
        }

        public VolwareNotFoundException(int entityId, Type type)
        {
            _message = $"Entity with id {entityId} did not found of type {type.Name}";
        }

        public VolwareNotFoundException(string entityId, Type type)
        {
            _message = $"Entity with id {entityId} did not found of type {type.Name}";
        }

        public override string Message => _message;
    }
}
