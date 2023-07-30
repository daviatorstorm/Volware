namespace Volware.Common.Filtering
{
    public static class FilteringEtensions
    {
        public static IQueryable<T> Paginate<T>(this IQueryable<T> entities, FilterParams filterParams) where T : class, new()
        {
            return entities
                .Skip(filterParams.Skip)
                .Take(filterParams.S);
        }
    }
}
