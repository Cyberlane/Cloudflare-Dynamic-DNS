# Cloudflare-Dynamic-DNS

I have my DNS running through Cloudflare, even the DNS entry which points to my computer at home. Unfortunately, my ISP does not provide dedicate IP addresses, but on the plus side, Cloudflare has a really good API for doing almost everything. So I created this simple NodeJS script which will update the sub-domain with my computer's public IP address.

You are welcome to modify this however you see fit.

## Configuration File

For the configuration file I am using the standard `.env` format. If you are not familiar with this, all you need to do is create a `.env` file in the root directory, copying the following (and replacing with your information).

```json
email="me@domain.com"
key="12345678901234567890"
domain="domain.com"
subDomain="sub.domain.com"
```
