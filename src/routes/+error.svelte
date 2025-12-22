<script lang="ts">
  import { page } from '$app/state';
</script>

<h1>{page.status} {page.error?.message}</h1>
<span>from fallback error page in routes</span>
