<div class="acp-page-container">
	<div component="settings/main/header" class="row border-bottom py-2 m-0 sticky-top acp-page-main-header align-items-center">
		<div class="col-12 col-md-8 px-0 mb-1 mb-md-0">
			<h4 class="fw-bold tracking-tight mb-0">[[username-denylist:title]]</h4>
		</div>
		<div class="col-12 col-md-4 px-0 px-md-3 text-end d-flex justify-content-end gap-1">
			<button id="save" class="btn btn-primary btn-sm">
				<i class="fa fa-floppy-disk"></i> [[username-denylist:save]]
			</button>
		</div>
	</div>

	<div class="row m-0">
		<div class="col-12 col-md-8 px-0">
			<form id="username-denylist-settings" class="username-denylist-settings">
				<div class="mb-4">
					<label for="literals" class="form-label fw-bold">[[username-denylist:literals-label]]</label>
					<p class="form-text text-muted mb-2">[[username-denylist:literals-help]]</p>
					<textarea id="literals" name="literals" class="form-control" rows="8" spellcheck="false" placeholder="admin&#10;root&#10;moderator"></textarea>
				</div>

				<div class="mb-4">
					<label for="patterns" class="form-label fw-bold">[[username-denylist:patterns-label]]</label>
					<p class="form-text text-muted mb-2">[[username-denylist:patterns-help]]</p>
					<textarea id="patterns" name="patterns" class="form-control" rows="8" spellcheck="false" placeholder="^mod[0-9]+$&#10;/staff/i"></textarea>
				</div>
			</form>
		</div>
	</div>
</div>
