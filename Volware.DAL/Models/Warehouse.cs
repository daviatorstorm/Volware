namespace Volware.DAL.Models
{
    public class Warehouse : BaseHistoryModel
    {
        public string City { get; set; }
        public string Address { get; set; }

        public int Iterator { get; set; }

        public IEnumerable<TempUser> Users { get; set; }
        public IEnumerable<ActionLog> Actions { get; set; }
    }
}
