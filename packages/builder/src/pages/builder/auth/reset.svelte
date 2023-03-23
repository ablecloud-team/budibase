<script>
  import { Body, Button, Heading, Layout, notifications } from "@budibase/bbui"
  import { goto, params } from "@roxi/routify"
  import { auth, organisation } from "stores/portal"
  import Logo from "assets/bb-emblem.svg"
  import { TestimonialPage } from "@budibase/frontend-core/src/components"
  import { FancyForm, FancyInput } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { handleError, passwordsMatch } from "./_components/utils"

  const resetCode = $params["?code"]
  let form
  let formData = {}
  let errors = {}
  let loaded = false

  $: submitted = false
  $: forceResetPassword = $auth?.user?.forceResetPassword

  async function reset() {
    form.validate()
    if (Object.keys(errors).length > 0) {
      return
    }
    submitted = true
    try {
      if (forceResetPassword) {
        await auth.updateSelf({
          password: formData.password,
          forceResetPassword: false,
        })
        $goto("../portal/")
      } else {
        await auth.resetPassword(formData.password, resetCode)
        notifications.success("비밀번호 재설정을 완료하였습니다.")
        // send them to login if reset successful
        $goto("./login")
      }
    } catch (err) {
      submitted = false
      notifications.error("비밀번호 재설정 오류입니다.")
    }
  }

  onMount(async () => {
    try {
      await auth.getSelf()
      await organisation.init()
    } catch (error) {
      notifications.error("Error getting org config")
    }
    loaded = true
  })
</script>

<TestimonialPage>
  <Layout gap="S" noPadding>
    {#if loaded}
      <img alt="logo" src={$organisation.logoUrl || Logo} />
    {/if}
    <Layout gap="XS" noPadding>
      <Heading size="M">비밀번호 초기화</Heading>
      <Body size="M">새 비밀번호를 입력하세요.</Body>
    </Layout>

    <Layout gap="S" noPadding>
      <FancyForm bind:this={form}>
        <FancyInput
          label="비밀번호"
          value={formData.password}
          type="password"
          on:change={e => {
            formData = {
              ...formData,
              password: e.detail,
            }
          }}
          validate={() => {
            let fieldError = {}

            fieldError["password"] = !formData.password
              ? "비밀번호를 입력하세요."
              : undefined

            fieldError["confirmationPassword"] =
              !passwordsMatch(
                formData.password,
                formData.confirmationPassword
              ) && formData.confirmationPassword
                ? "비밀번호가 일치해야 합니다."
                : undefined

            errors = handleError({ ...errors, ...fieldError })
          }}
          error={errors.password}
          disabled={submitted}
        />
        <FancyInput
          label="비밀번호 확인"
          value={formData.confirmationPassword}
          type="password"
          on:change={e => {
            formData = {
              ...formData,
              confirmationPassword: e.detail,
            }
          }}
          validate={() => {
            const isValid =
              !passwordsMatch(
                formData.password,
                formData.confirmationPassword
              ) && formData.password

            let fieldError = {
              confirmationPassword: isValid
                ? "비밀번호가 일치해야 합니다."
                : null,
            }

            errors = handleError({ ...errors, ...fieldError })
          }}
          error={errors.confirmationPassword}
          disabled={submitted}
        />
      </FancyForm>
    </Layout>
    <div>
      <Button
        disabled={Object.keys(errors).length > 0 ||
          (forceResetPassword ? false : !resetCode)}
        cta
        on:click={reset}>비밀번호 재설정</Button
      >
    </div>
  </Layout>
</TestimonialPage>

<style>
  img {
    width: 48px;
  }
</style>
