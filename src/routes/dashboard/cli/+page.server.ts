import { db } from '$lib/server/db';
import * as s from '$lib/server/db/schema';
import { desc, count, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { PgSelect } from 'drizzle-orm/pg-core';

export const load = (async () => {


    const getTotalCliUsage = db
        .select({ count: count(s.cliUsage.id) })
        .from(s.cliUsage);

    const getTemplateUsage = db
        .select({ template: s.cliUsage.template, count: count(s.cliUsage.id) })
        .from(s.cliUsage)
        .groupBy(s.cliUsage.template)
        .orderBy(desc(count(s.cliUsage.id)));
    const getEventUsage = db
        .select({ template: s.cliUsage.template, event: s.cliUsage.code, count: count(s.cliUsage.id) })
        .from(s.cliUsage)
        .groupBy(s.cliUsage.template, s.cliUsage.code)
        .orderBy(desc(count(s.cliUsage.id)));


    const getLast10Events = db
        .select()
        .from(s.cliUsage)
        // .groupBy(s.cliUsage.template, s.cliUsage.code)
        // .orderBy(desc(count(s.cliUsage.id)))
        .limit(10);

    const [totalCliUsage, templateUsage, eventUsage, last10] = await Promise.all([

        getTotalCliUsage,

        getTemplateUsage,
        getEventUsage,
        getLast10Events
    ]);

    return {

        totalCliUsage: totalCliUsage[0].count,

        templateUsage: templateUsage,
        eventUsage: eventUsage,
        last10Events: last10
    };
}) satisfies PageServerLoad;