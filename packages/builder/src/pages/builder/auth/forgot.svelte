<script>
  import {
    notifications,
    Button,
    Layout,
    Body,
    Heading,
    Icon,
  } from "@budibase/bbui"
  import { organisation, auth } from "stores/portal"
  import Logo from "assets/bb-emblem.svg"
  import { onMount } from "svelte"
  import { goto } from "@roxi/routify"
  import { TestimonialPage } from "@budibase/frontend-core/src/components"
  import { FancyForm, FancyInput } from "@budibase/bbui"

  let email = ""
  let form
  let error
  let submitted = false

  async function forgot() {
    form.validate()
    if (error) {
      return
    }
    submitted = true
    try {
      await auth.forgotPassword(email)
      notifications.success("이메일을 보냈습니다 - 받은 편지함을 확인하십시오")
    } catch (err) {
      submitted = false
      notifications.error("비밀번호 재설정 링크를 보낼 수 없습니다.")
    }
  }

  onMount(async () => {
    try {
      await organisation.init()
    } catch (error) {
      notifications.error("Error getting org config")
    }
  })
</script>

<TestimonialPage>
  <Layout gap="S" noPadding>
    <img alt="logo" src={$organisation.logoUrl || Logo} />
    <span class="heading-wrap">
      <Heading size="M">
        <div class="heading-content">
          <span class="back-chev" on:click={() => $goto("../")}>
            <Icon name="ChevronLeft" size="XL" />
          </span>
          비밀번호를 잊으셨습니까?
        </div>
      </Heading>
    </span>
    <Layout gap="XS" noPadding>
      <Body size="M">
        계정의 이메일 주소를 입력하면 재설정 링크를 보내드립니다.
      </Body>
    </Layout>

    <Layout gap="S" noPadding>
      <FancyForm bind:this={form}>
        <FancyInput
          label="이메일을 입력해주세요."
          value={email}
          on:change={e => {
            email = e.detail
          }}
          validate={() => {
            if (!email) {
              return "이메일을 입력해주세요."
            }
            return null
          }}
          {error}
          disabled={submitted}
        />
      </FancyForm>
    </Layout>
    <div>
      <Button
        size="L"
        disabled={!email || error || submitted}
        cta
        on:click={forgot}
      >
        비밀번호 재설정
      </Button>
    </div>
  </Layout>
</TestimonialPage>

<style>
  img {
    width: 46px;
  }
  .back-chev {
    display: inline-block;
    cursor: pointer;
    margin-left: -5px;
  }
  .heading-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }
</style>
