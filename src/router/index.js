import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: 'Login' },
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('@/views/main/Main.vue'),
    // meta: { title: '主畫面' },
    children: [
      { path: 'functionlist', name: 'functionlist', component: () => import('@/views/main/FunctionList.vue') },
      { path: 'Personnel', name: 'Personnel', component: () => import('@/views/main/Personnel/index.vue') },
      { path: 'User', name: 'User', component: () => import('@/views/main/User/index.vue') },

      {
        path: 'Documents', name: 'Documents', component: () => import('@/views/main/Documents/index.vue'),
        children: [
          { path: 'Signlife', name: 'Signlife', component: () => import('@/views/main/Documents/Signlife/index.vue') },
          { path: 'Nursingplan', name: 'Nursingplan', component: () => import('@/views/main/Documents/Nursingplan/index.vue') },
          { path: 'Nursingrecord', name: 'Nursingrecord', component: () => import('@/views/main/Documents/Nursingrecord/index.vue') },
          { path: 'PriceList', name: 'PriceList', component: () => import('@/views/main/Documents/PriceList/index.vue') },
          { path: 'Pipeline', name: 'Pipeline', component: () => import('@/views/main/Documents/Pipeline/index.vue') },
          { path: 'Inspectionreport', name: 'Inspectionreport', component: () => import('@/views/main/Documents/Inspectionreport/index.vue') },
          { path: 'Spmsq', name: 'Spmsq', component: () => import('@/views/main/Documents/Spmsq/index.vue') },
          { path: 'Hour72', name: 'Hour72', component: () => import('@/views/main/Documents/Hour72/index.vue') },
          { path: 'Sociopsychological', name: 'Sociopsychological', component: () => import('@/views/main/Documents/Sociopsychological/index.vue') },
          { path: 'Servicerecord', name: 'Servicerecord', component: () => import('@/views/main/Documents/Servicerecord/index.vue') },
          { path: 'Adaptability', name: 'Adaptability', component: () => import('@/views/main/Documents/Adaptability/index.vue') },
          { path: 'Treatment', name: 'Treatment', component: () => import('@/views/main/Documents/Treatment/index.vue') },
          { path: 'Rehabilitation', name: 'Rehabilitation', component: () => import('@/views/main/Documents/Rehabilitation/index.vue') },

          // { path: 'recordlist', name: 'recordlist', component: resolve => require(['../views/document/RecordList.vue'], resolve) },
          // { path: 'adaptlist', name: 'adaptlist', component: resolve => require(['../views/document/AdaptList.vue'], resolve) },
          // { path: 'kblist', name: 'kblist', component: resolve => require(['../views/document/KbList.vue'], resolve) },
          // { path: 'falllist', name: 'falllist', component: resolve => require(['../views/document/FallList.vue'], resolve) },
          // { path: 'bradenlist', name: 'bradenlist', component: resolve => require(['../views/document/BradenList.vue'], resolve) },
          // { path: 'medicinerecordlist', name: 'medicinerecordlist', component: resolve => require(['../views/document/MedicineRecordList.vue'], resolve) },
          
          
          // { path: 'nursingassessment', name: 'nursingassessment', component: resolve => require(['../views/document/Nursingassessment.vue'], resolve) },
          
          
          
          
          // { path: 'melancholylist', name: 'melancholylist', component: resolve => require(['../views/document/MelancholyList.vue'], resolve) },
          
          
          
          // { path: 'hour72nutrition', name: 'hour72nutrition', component: resolve => require(['../views/document/Hour72Nutrition.vue'], resolve) },
          // { path: 'nutritionlist', name: 'nutritionlist', component: resolve => require(['../views/document/NutritionList.vue'], resolve) },
          // { path: 'consultationlist', name: 'consultationlist', component: resolve => require(['../views/document/ConsultationList.vue'], resolve) },
          // { path: 'pharmacistevaluationlist', name: 'pharmacistevaluationlist', component: resolve => require(['../views/document/PharmacistEvaluationList.vue'], resolve) },
          // { path: 'medicationevaluationlist', name: 'medicationevaluationlist', component: resolve => require(['../views/document/MedicationEvaluationList.vue'], resolve) },

          //衛服部專用表單
          // { path: 'HealthyHabits', name: 'HealthyHabits', component: resolve => require(['../views/document/mohw/HealthyHabits'], resolve) },
          // { path: 'MedicalHistories', name: 'MedicalHistories', component: resolve => require(['../views/document/mohw/MedicalHistories'], resolve) },
          // { path: 'DrugSafeties', name: 'DrugSafeties', component: resolve => require(['../views/document/mohw/DrugSafeties'], resolve) },
          // { path: 'BodyEvaluations', name: 'BodyEvaluations', component: resolve => require(['../views/document/mohw/BodyEvaluations'], resolve) },
          // { path: 'PressureInjuries', name: 'PressureInjuries', component: resolve => require(['../views/document/mohw/PressureInjuries'], resolve) },
          // { path: 'FallRisks', name: 'FallRisks', component: resolve => require(['../views/document/mohw/FallRisks'], resolve) },
          // { path: 'ADLs', name: 'ADLs', component: resolve => require(['../views/document/mohw/ADLs'], resolve) },
          // { path: 'IADLs', name: 'IADLs', component: resolve => require(['../views/document/mohw/IADLs'], resolve) },
          // { path: 'Dementias', name: 'Dementias', component: resolve => require(['../views/document/mohw/Dementias'], resolve) },
          // { path: 'GeriatricDepressionScales', name: 'GeriatricDepressionScales', component: resolve => require(['../views/document/mohw/GeriatricDepressionScales'], resolve) },
          // { path: 'BSRS5s', name: 'BSRS5s', component: resolve => require(['../views/document/mohw/BSRS5s'], resolve) },
          // { path: 'MNASFs', name: 'MNASFs', component: resolve => require(['../views/document/mohw/MNASFs'], resolve) },
          // { path: 'PainEvaluations', name: 'PainEvaluations', component: resolve => require(['../views/document/mohw/PainEvaluations'], resolve) },
          // { path: 'SOFs', name: 'SOFs', component: resolve => require(['../views/document/mohw/SOFs'], resolve) },

          // { path: 'CaseSummaryPlan', name: 'CaseSummaryPlan', component: resolve => require(['../views/document/mohw/CaseSummaryPlan'], resolve) },
          // { path: 'CareRecord', name: 'CareRecord', component: resolve => require(['../views/document/mohw/CareRecord'], resolve) },

          // //六大評估指標表單
          // { path: 'FallEvent', name: 'FallEvent', component: resolve => require(['../views/document/EvaluationMetrics/FallEvent'], resolve) },
          // { path: 'PressureEvent', name: 'PressureEvent', component: resolve => require(['../views/document/EvaluationMetrics/PressureEvent'], resolve) },
          // { path: 'InfectionEvent', name: 'InfectionEvent', component: resolve => require(['../views/document/EvaluationMetrics/InfectionEvent'], resolve) },
          // { path: 'ConstraintEvent', name: 'ConstraintEvent', component: resolve => require(['../views/document/EvaluationMetrics/ConstraintEvent'], resolve) },
          // { path: 'UnplannedEvent', name: 'UnplannedEvent', component: resolve => require(['../views/document/EvaluationMetrics/UnplannedEvent'], resolve) },


        ]
      },
    ]
  },

  //列印區
  { path: '/NursingplanPrint', name: 'NursingplanPrint', component: () => import('@/views/main/Documents/Nursingplan/PrintPage.vue') },
  { path: '/NursingrecordPrint', name: 'NursingrecordPrint', component: () => import('@/views/main/Documents/Nursingrecord/PrintPage.vue') },
  { path: '/InspectionreportPrint', name: 'InspectionreportPrint', component: () => import('@/views/main/Documents/Inspectionreport/PrintPage.vue') },
  { path: '/MultiDocumentPrint', name: 'MultiDocumentPrint', component: () => import('@/views/print/MultiDocumentPrint.vue') },
  { path: '/Hour72Print', name: 'Hour72Print', component: () => import('@/views/main/Documents/Hour72/PrintPage.vue') },
  { path: '/SociopsychologicalPrint', name: 'SociopsychologicalPrint', component: () => import('@/views/main/Documents/Sociopsychological/PrintPage.vue') },
  { path: '/ServicerecordPrint', name: 'ServicerecordPrint', component: () => import('@/views/main/Documents/Servicerecord/PrintPage.vue') },
  { path: '/AdaptabilityPrint', name: 'AdaptabilityPrint', component: () => import('@/views/main/Documents/Adaptability/PrintPage.vue') },
  { path: '/TreatmentPrint', name: 'TreatmentPrint', component: () => import('@/views/main/Documents/Treatment/PrintPage.vue') },
  { path: '/print/rehabilitationprint', name: 'RehabilitationPrint', component: () => import('@/views/main/Documents/Rehabilitation/PrintPage.vue') },
  
  // {
  //   path: '/orderpage',
  //   name: 'orderpage',
  //   component: () => import('@/views/orderpage/index.vue'),
  //   meta: { title: '會員功能' },
  // },
  // 將 404 路由放在最後
  { path: '/:pathMatch(.*)*', redirect: '/' },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.title != undefined) {
    window.document.title = to.meta.title
  } else {
    window.document.title = '日照管理系統'
  }
  next()
})

export default router
