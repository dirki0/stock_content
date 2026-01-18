<script setup lang="ts">
interface Props {
  user: SelectUser;
}
const props = defineProps<Props>();

const open = defineModel({ default: false, type: Boolean });

const isLoading = ref(false);

const { t } = useI18n();
const { showErrorToast, showSuccessToast } = useAppToast();
const { client } = useAuth();
const logger = useLogger();

async function unbanUser() {
  isLoading.value = true;

  try {
    const { error } = await client.admin.unbanUser({ userId: props.user.id });

    if (error) {
      logger.error("Failed to unban user", error);
      showErrorToast(t("pages.admin.users.unbanUserModal.toast.error"), error);
      return;
    }

    showSuccessToast({
      title: t("pages.admin.users.unbanUserModal.toast.success"),
    });
    open.value = false;
  } catch (error: any) {
    logger.error("Failed to unban user", error);
    showErrorToast(t("pages.admin.users.unbanUserModal.toast.error"), error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="t('pages.admin.users.unbanUserModal.title')"
    :description="t('pages.admin.users.unbanUserModal.description')"
  >
    <template #body>
      <div class="space-y-4">
        <UFormField
          :label="t('pages.admin.users.unbanUserModal.reasonLabel')"
          name="bannedReason"
          size="lg"
        >
          <UTextarea
            :model-value="user.bannedReason"
            :rows="4"
            class="w-full"
            disabled
          />
        </UFormField>
        <div class="mt-6! flex justify-end space-x-2">
          <UButton variant="soft" color="neutral" @click="open = false">
            {{ t("pages.admin.users.unbanUserModal.cancelButton") }}
          </UButton>
          <UButton
            variant="soft"
            color="success"
            :loading="isLoading"
            :disabled="isLoading"
            @click="unbanUser"
          >
            {{ t("pages.admin.users.unbanUserModal.confirmButton") }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
