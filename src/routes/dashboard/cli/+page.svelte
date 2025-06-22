<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="mx-auto max-w-3xl space-y-8 p-6">
	<!-- Total CLI Usage Card -->
	<div class="flex items-center justify-between rounded-lg bg-blue-100 p-6 shadow">
		<div>
			<h2 class="text-lg font-semibold text-blue-800">Total CLI Usage</h2>
			<p class="text-4xl font-bold text-blue-900">{data.totalCliUsage}</p>
		</div>
		<svg
			class="h-12 w-12 text-blue-400"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			viewBox="0 0 24 24"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M9 17v-2a4 4 0 014-4h4m0 0V7m0 4l-4-4-4 4"
			/></svg
		>
	</div>

	<!-- Template Usage Table -->
	<div>
		<h3 class="text-md mb-2 font-semibold text-gray-700">Template Usage</h3>
		<div class="overflow-x-auto">
			<table class="min-w-full rounded-lg bg-white shadow">
				<thead>
					<tr class="bg-gray-100 text-xs text-gray-600 uppercase">
						<th class="px-4 py-3 text-left">Template</th>
						<th class="px-4 py-3 text-left">Count</th>
					</tr>
				</thead>
				<tbody>
					{#each data.templateUsage as t}
						<tr class="border-b last:border-none">
							<td class="px-4 py-2 font-medium">{t.template}</td>
							<td class="px-4 py-2">{t.count}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Event Usage Table -->
	<div>
		<h3 class="text-md mb-2 font-semibold text-gray-700">Event Usage</h3>
		<div class="overflow-x-auto">
			<table class="min-w-full rounded-lg bg-white shadow">
				<thead>
					<tr class="bg-gray-100 text-xs text-gray-600 uppercase">
						<th class="px-4 py-3 text-left">Template</th>
						<th class="px-4 py-3 text-left">Event</th>
						<th class="px-4 py-3 text-left">Count</th>
					</tr>
				</thead>
				<tbody>
					{#each data.eventUsage as e}
						<tr class="border-b last:border-none">
							<td class="px-4 py-2 font-medium">{e.template}</td>
							<td class="px-4 py-2">{e.event}</td>
							<td class="px-4 py-2">{e.count}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Last 10 Events Table -->
<div>
    <h3 class="text-md mb-2 font-semibold text-gray-700">Last 10 Events</h3>
    <div class="overflow-x-auto">
        <table class="min-w-full rounded-lg bg-white shadow">
            <thead>
                <tr class="bg-gray-100 text-xs text-gray-600 uppercase">
                    <th class="px-4 py-3 text-left">CODE</th>
                    <th class="px-4 py-3 text-left">Template</th>
                    <th class="px-4 py-3 text-left">Git User</th>
                    <th class="px-4 py-3 text-left">METADATA</th>
                </tr>
            </thead>
            <tbody>
                {#each data.last10Events as evt}
                    <tr class="border-b last:border-none">
                        <td class="px-4 py-2">{evt.code}</td>
                        <td class="px-4 py-2">{evt.template}</td>
                        <td class="px-4 py-2">{evt.gitUser}</td>
                        <td class="px-4 py-2">{JSON.stringify(evt.metadata)}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
