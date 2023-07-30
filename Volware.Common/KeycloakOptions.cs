namespace Volware.Common
{
    public class KeycloakOptions
    {
        public string Url { get; set; }
        public string Realm { get; set; }
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }

        public string Username { get; set; }
        public string Password { get; set; }

        public string GrantType { get; set; }

        public string FrontendUri { get; set; }
    }
}
