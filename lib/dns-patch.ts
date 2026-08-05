/**
 * Local escape hatch for "querySrv ECONNREFUSED" against Atlas on networks whose
 * resolver mishandles SRV records or stalls on IPv6.
 *
 * Opt-in and never active in production: it forces Google's resolvers and pins every
 * lookup to IPv4 process-wide, which on a deployment would override the platform
 * resolver and break private/VPC hostnames and IPv6-only egress.
 *
 * Enable locally with ENABLE_DNS_PATCH="1" in .env.local.
 */
import dns from 'node:dns';

const enabled =
    process.env.ENABLE_DNS_PATCH === '1' && process.env.NODE_ENV !== 'production';

if (enabled) {
    applyDnsPatch();
}

function applyDnsPatch() {
    const originalLookup = dns.lookup;

    try {
        dns.setDefaultResultOrder('ipv4first');
    } catch (e) {
        console.warn('⚠️ [DNS Patch] Could not set DNS result order', e);
    }

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

    type ResolveFn = (...args: unknown[]) => unknown;

    const patchResolve = (target: object, method: string, type: string) => {
        const host = target as Record<string, ResolveFn>;
        const original = host[method];
        host[method] = (...args: unknown[]) => {
            const hostname = args[0];
            if (typeof hostname === 'string' && hostname.includes('mongodb.net')) {
                console.log(`🔍 [DNS Patch] Resolving ${type} for: ${hostname}`);
            }
            return original.apply(target, args);
        };
    };

    patchResolve(dns, 'resolveSrv', 'SRV');
    patchResolve(dns, 'resolveTxt', 'TXT');
    patchResolve(dns.promises, 'resolveSrv', 'SRV (Promise)');
    patchResolve(dns.promises, 'resolveTxt', 'TXT (Promise)');

    console.log('✅ [DNS Patch] Applied to Callback & Promise APIs');
}
