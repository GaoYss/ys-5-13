<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import StatusBanner from '../components/StatusBanner.vue'
import { useLoyaltyData } from '../stores/useLoyaltyData'

const { state, refreshAll, createMember, highlightMember, clearDuplicateMember } = useLoyaltyData()
const form = reactive({ name: '', phone: '', birthday: '2000-01-01' })
const memberListRef = ref(null)
const memberRowRefs = ref({})

onMounted(refreshAll)

function setMemberRowRef(el, id) {
  if (el) {
    memberRowRefs.value[id] = el
  }
}

async function goToMember(member) {
  highlightMember(member.id)
  await nextTick()
  const row = memberRowRefs.value[member.id]
  if (row && memberListRef.value) {
    row.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

async function submitMember() {
  try {
    await createMember({ ...form })
    Object.assign(form, { name: '', phone: '', birthday: '2000-01-01' })
  } catch (e) {
  }
}
</script>

<template>
  <section class="view-stack">
    <div class="section-header">
      <div>
        <p class="eyebrow">Members</p>
        <h2>会员管理</h2>
      </div>
      <StatusBanner :error="state.duplicateMember ? '' : state.error" :notice="state.notice" :loading="state.loading" />
    </div>

    <div v-if="state.duplicateMember" class="duplicate-alert panel">
      <div class="duplicate-header">
        <span class="duplicate-icon">⚠️</span>
        <div class="duplicate-title">
          <strong>{{ state.error }}</strong>
        </div>
        <button class="close-button" @click="clearDuplicateMember">×</button>
      </div>
      <div class="duplicate-body">
        <div class="member-info-grid">
          <div class="info-item">
            <span class="info-label">姓名</span>
            <span class="info-value">{{ state.duplicateMember.name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">手机号</span>
            <span class="info-value">{{ state.duplicateMember.phone }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">生日</span>
            <span class="info-value">{{ state.duplicateMember.birthday }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">会员等级</span>
            <span class="info-value">{{ state.duplicateMember.tier_name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">积分</span>
            <span class="info-value">{{ state.duplicateMember.points }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">注册时间</span>
            <span class="info-value">{{ state.duplicateMember.created_at }}</span>
          </div>
        </div>
        <div class="benefits-line">
          <span class="info-label">会员权益：</span>
          <span class="info-value">{{ state.duplicateMember.benefits.join('、') }}</span>
        </div>
      </div>
      <div class="duplicate-actions">
        <button class="primary-button" @click="goToMember(state.duplicateMember)">查看会员详情 →</button>
      </div>
    </div>

    <div class="two-column">
      <form class="panel" @submit.prevent="submitMember">
        <h3>新增会员</h3>
        <label>
          姓名
          <input v-model.trim="form.name" required type="text" />
        </label>
        <label>
          手机号
          <input v-model.trim="form.phone" required type="tel" />
        </label>
        <label>
          生日
          <input v-model="form.birthday" required type="date" />
        </label>
        <button class="primary-button" type="submit">创建会员</button>
      </form>

      <section class="panel wide-panel" ref="memberListRef">
        <h3>会员列表</h3>
        <div class="data-table">
          <div class="table-head">
            <span>会员</span>
            <span>等级</span>
            <span>积分</span>
            <span>权益</span>
          </div>
          <div
            v-for="member in state.members"
            :key="member.id"
            class="table-row"
            :class="{ 'highlight-row': state.highlightMemberId === member.id }"
            :ref="(el) => setMemberRowRef(el, member.id)"
          >
            <span>{{ member.name }}<small>{{ member.phone }}</small></span>
            <span>{{ member.tier_name }}</span>
            <span>{{ member.points }}</span>
            <span>{{ member.benefits.join('、') }}</span>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>
