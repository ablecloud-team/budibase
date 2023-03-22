<script>
  import { ModalContent, Body, Input, notifications } from "@budibase/bbui"
  import { writable } from "svelte/store"
  import { auth } from "stores/portal"

  const values = writable({
    firstName: $auth.user.firstName,
    lastName: $auth.user.lastName,
  })

  const updateInfo = async () => {
    try {
      await auth.updateSelf($values)
      notifications.success("정보가 성공적으로 변경되었습니다.")
    } catch (error) {
      console.error(error)
      notifications.error("정보를 변경하지 못했습니다.")
    }
  }
</script>

<ModalContent title="내 프로필" confirmText="확인" onConfirm={updateInfo}>
  <Body size="S">이름과 성을 입력하실수 있습니다.</Body>
  <Input disabled bind:value={$auth.user.email} label="이메일" />
  <Input bind:value={$values.firstName} label="이름" />
  <Input bind:value={$values.lastName} label="성" />
</ModalContent>
