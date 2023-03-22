<script>
  import { ModalContent, Body, notifications } from "@budibase/bbui"
  import PasswordRepeatInput from "components/common/users/PasswordRepeatInput.svelte"
  import { auth } from "stores/portal"

  let password
  let error

  const updatePassword = async () => {
    try {
      await auth.updateSelf({ password })
      notifications.success("비밀번호가 성공적으로 변경되었습니다.")
    } catch (error) {
      notifications.error("비밀번호를 변경하지 못했습니다.")
    }
  }
</script>

<ModalContent
  title="비밀번호 수정"
  confirmText="비밀번호 수정"
  onConfirm={updatePassword}
  disabled={error || !password}
>
  <Body size="S">새로운 비밀번호를 입력해주세요.</Body>
  <PasswordRepeatInput bind:password bind:error />
</ModalContent>
