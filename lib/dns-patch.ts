/**
 * Local-development escape hatch for "querySrv ECONNREFUSED" when connecting to
 * MongoDB Atlas from networks whose resolver mishandles SRV records or stalls on
 * IPv6.
 *
 * This is OPT-IN and never applies in production. It rewrites process-global DNS
 * behaviour — forcing Google's public resolvers and pinning every lookup to IPv4
 * — which on a real deployment would override the platform resolver and break
 * private/VPC hostnames, internal service discovery, and IPv6-only egress.
 *
 * Enable for local work only, in .env.local:
 *   ENABLE_DNS_PATCH="1"
 */
import dns from 'node:dns';

const enabled =
    process.env.ENABLE_DNS_PATCH === '1' && process.env.NODE_ENV !== 'production';

if (enabled) {
    applyDnsPatch();
}

function applyDnsPatch() {
    const originalLookup = dns.lookup;

    const forcedServers = ['8.8.8.8', '8.8.4.4'];
    try {
        dns.setServers(forcedServers);
        console.log(`✅ [DNS Patch] Forced Google DNS (${forcedServers.join(', ')}) — development only`);
    } catch (e) {
        console.warn('⚠️ [DNS Patch] Failed to set custom DNS servers', e);
    }

    // @ts-expect-error — replacing an overloaded Node builtin
    dns.lookup = (hostname, options, callback) => {
        if (typeof options === 'function') {
            callback = options;
            options = { family: 4 };
        } else if (typeof options === 'number' || !options) {
            options = { family: 4 };
        } else if (typeof options === 'object') {
            options = { ...options, family: 4 };
        }

        if (hostname.includes('mongodb.net')) {
            console.log(`🔍 [DNS Patch] Lookup: ${hostname}`);
        }

        // @ts-expect-error — forwarding the original variadic signature
        return originalLookup(hostname, options, callback);
    };

    const patchResolve = (obj: any, method: string, type: string) => {
        const original = obj[method];
        obj[method] = (...args: any[]) => {
            const hostname = args[0];
            if (typeof hostname === 'string' && hostname.includes('mongodb.net')) {
                console.log(`🔍 [DNS Patch] Resolving ${type} for: ${hostname}`);
            }
            return original.apply(obj, args);
        };
    };

    patchResolve(dns, 'resolveSrv', 'SRV');
    patchResolve(dns, 'resolveTxt', 'TXT');
    patchResolve(dns.promises, 'resolveSrv', 'SRV (Promise)');
    patchResolve(dns.promises, 'resolveTxt', 'TXT (Promise)');

    console.log('✅ [DNS Patch] Applied to Callback & Promise APIs');
}
