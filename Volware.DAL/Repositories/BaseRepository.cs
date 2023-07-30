using Microsoft.EntityFrameworkCore;
using Volware.DAL.Models;

namespace Volware.DAL.Repositories
{
    public abstract class BaseRepository<T> where T : BaseModel, new()
    {
        public BaseRepository(VolwareDBContext context)
        {
            Context = context;
            Entities = context.Set<T>();
        }

        protected DbSet<T> Entities { get; private set; }
        protected VolwareDBContext Context { get; private set; }

        public virtual async Task<T> Add(T model)
        {
            return (await Context.AddAsync(model)).Entity;
        }

        public virtual async Task<T> GetById(int id)
        {
            return await Entities.FirstOrDefaultAsync(x => x.Id == id);
        }

        public virtual void Remove(int id)
        {
            Context.Remove(new T { Id = id });
        }

        public async Task SaveChangesAsync()
        {
            await Context.SaveChangesAsync();
        }
    }
}
