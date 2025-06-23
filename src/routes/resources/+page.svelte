<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	import { enhance } from '$app/forms';

	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Get current status from URL params, default to empty string for "all"
	// let selectedStatus = $page.url.searchParams.get('status') || '';

	// Handle status filter change
	function handleStatusChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const newStatus = target.value;

		// Create new URL with updated status and reset page to 1
		const url = new URL(page.url);

		if (newStatus === '') {
			// Remove status param if "all" is selected
			url.searchParams.delete('status');
		} else {
			url.searchParams.set('status', newStatus);
		}

		// Always reset to page 1 when filtering
		url.searchParams.set('page', '1');

		// Navigate to the new URL
		goto(url.toString());
	}

	// Helper function to build pagination URLs with current filters
	function buildPaginationUrl(pageNum: number): string {
		const url = new URL(page.url);
		url.searchParams.set('page', pageNum.toString());
		return url.toString();
	}
</script>

<div class="min-h-[80vh] bg-base-200 py-8">
	<div class="container mx-auto px-4">
		<!-- Page Header -->
		<!-- <div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Resources</h1>
			<p class="mt-2 text-gray-600">Manage and view all your resources</p>
		</div> -->

		<!-- Alert Messages -->
		{#if form?.message && form?.success}
			<div class="alert alert-success mb-6">
				<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
				<span>{form.message}</span>
			</div>
		{/if}

		{#if form?.message && !form?.success}
			<div class="alert alert-error mb-6">
				<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
				<span>{form.message}</span>
			</div>
		{/if}

		<!-- Stats Card -->
		<div class="card bg-base-100 shadow-sm mb-6">
			<div class="card-body">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm opacity-70">Total Resources</p>
						<p class="text-2xl font-bold">{data.totalCount}</p>
						<form method="POST" action="?/embedAllPending" use:enhance>
							<button
								type="submit"
								class="btn btn-primary btn-sm mt-2"
							>
								Embed all pending
							</button>
						</form>
					</div>
					<div class="text-right">
						<p class="text-sm opacity-70">
							Page {data.page} of {data.totalPages}
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Resources Table -->
		<div class="card bg-base-100 shadow-sm overflow-hidden">
			<div class="card-title p-6 border-b">
				<h2 class="text-lg">All Resources</h2>
			</div>

			<div class="overflow-x-auto">
				<table class="table table-zebra">
					<thead>
						<tr>
							<th>ID</th>
							<th>Created By</th>
							<th>Created At</th>
							<th>Status</th>
							<th>Source</th>
							<th>
								<span class="sr-only">Actions</span>
							</th>
						</tr>
						<!-- Filter row -->
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td>
								<select
									id="status"
									name="status"
									class="select select-bordered select-sm w-40"
									value={page.url.searchParams.get('status')}
									onchange={handleStatusChange}
								>
									<option value="">All Statuses</option>
									<option value="draft">Draft</option>
									<option value="published">Published</option>
									<option value="archived">Archived</option>
									<option value="deleted">Deleted</option>
									<option value="pending_review">Pending Review</option>
									<option value="pending_embedding">Pending Embeddings</option>
								</select>
							</td>
							<td></td>
							<td></td>
						</tr>
					</thead>
					<tbody>
						{#each data.resources as resource, index (resource.id)}
							<tr class="hover">
								<td>
									<span class="font-mono text-sm" title={resource.id}>
										{resource.id.length > 10 ? resource.id.substring(0, 10) + '...' : resource.id}
									</span>
								</td>
								<td>
									<div class="text-sm">{resource.createdBy}</div>
								</td>
								<td>
									<div class="text-sm">
										{new Date(resource.createdAt).toLocaleDateString('pt-BR', {
											year: 'numeric',
											month: '2-digit',
											day: '2-digit',
											hour: '2-digit',
											minute: '2-digit'
										})}
									</div>
								</td>
								<td>
									<span
										class="badge 
										{resource.status === 'published'
											? 'badge-success'
											: resource.status === 'draft'
												? 'badge-warning'
												: resource.status === 'archived'
													? 'badge-ghost'
													: resource.status === 'deleted'
														? 'badge-error'
														: resource.status === 'pending_review'
															? 'badge-info'
															: 'badge-neutral'}"
									>
										{resource.status}
									</span>
								</td>
								<td>
									<div class="text-sm">
										{resource.source && resource.source.length > 10
											? resource.source.substring(0, 10) + '...'
											: resource.source}
									</div>
								</td>
								<td class="text-right">
									<a
										href="/resources/{resource.id}"
										class="btn btn-ghost btn-sm"
									>
										<svg
											class="h-4 w-4 mr-1"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											/>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
											/>
										</svg>
										View
									</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Empty State -->
			{#if data.resources.length === 0}
				<div class="py-12 text-center">
					<div class="flex justify-center">
						<svg
							class="h-12 w-12 opacity-50"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
					</div>
					<h3 class="mt-2 font-medium">No resources found</h3>
					<p class="mt-1 text-sm opacity-70">
						{#if page.url.searchParams.get('status')}
							No resources found with status "{page.url.searchParams.get('status')}". Try selecting
							a different status or clear the filter.
						{:else}
							Get started by creating your first resource.
						{/if}
					</p>
				</div>
			{/if}
		</div>

		<!-- Pagination -->
		{#if data.totalPages > 1}
			<div class="mt-6 flex items-center justify-between">
				<div class="text-sm opacity-70">
					<span>
						Showing {(data.page - 1) * 10 + 1} to {Math.min(data.page * 10, data.totalCount)} of {data.totalCount}
						results
					</span>
				</div>

				<div class="join">
					{#if data.page > 1}
						<a
							href={buildPaginationUrl(data.page - 1)}
							class="join-item btn"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 19l-7-7 7-7"
								/>
							</svg>
							Previous
						</a>
					{/if}

					<!-- Page Numbers -->
					{#each Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
						const startPage = Math.max(1, data.page - 2);
						return startPage + i;
					}).filter((page) => page <= data.totalPages) as page, index (index)}
						<a
							href={buildPaginationUrl(page)}
							class="join-item btn {page === data.page ? 'btn-active' : ''}"
						>
							{page}
						</a>
					{/each}

					{#if data.page < data.totalPages}
						<a
							href={buildPaginationUrl(data.page + 1)}
							class="join-item btn"
						>
							Next
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</a>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>
