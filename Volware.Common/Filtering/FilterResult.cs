namespace Volware.Common.Filtering
{
    public class FilterResult<T> where T : class
    {
        public ICollection<T> Results { get; set; }
        public int Total { get; set; }
    }
}
