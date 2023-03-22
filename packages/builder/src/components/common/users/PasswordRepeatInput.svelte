<script>
  import { Layout, Input } from "@budibase/bbui"
  import {
    createValidationStore,
    requiredValidator,
  } from "../../../helpers/validation"

  export let password
  export let error

  const [firstPassword, passwordError, firstTouched] = createValidationStore(
    "",
    requiredValidator
  )
  // eslint-disable-next-line no-unused-vars
  const [repeatPassword, _, repeatTouched] = createValidationStore(
    "",
    requiredValidator
  )

  $: password = $firstPassword
  $: error =
    !$firstPassword ||
    !$firstTouched ||
    !$repeatTouched ||
    $firstPassword !== $repeatPassword
</script>

<Layout gap="XS" noPadding>
  <Input
    label="비밀번호"
    type="password"
    error={$firstTouched && $passwordError}
    bind:value={$firstPassword}
  />
  <Input
    label="비밀번호 확인"
    type="password"
    error={$repeatTouched &&
      $firstPassword !== $repeatPassword &&
      "비밀번호가 일치하지 않습니다."}
    bind:value={$repeatPassword}
  />
</Layout>
