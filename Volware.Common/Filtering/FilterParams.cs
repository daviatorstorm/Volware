namespace Volware.Common.Filtering
{
    public class FilterParams
    {
        public string Q { get; set; }
        public int P { get; set; } = 1;
        public int S { get; set; } = 20;

        public int Skip
        {
            get
            {
                return (P - 1) * S;
            }
        }
    }
}
