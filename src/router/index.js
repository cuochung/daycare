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
          //原生表單
          { path: 'Signlife', name: 'Signlife', component: () => import('@/views/main/Documents/Original/Signlife/index.vue') },
          { path: 'Nursingplan', name: 'Nursingplan', component: () => import('@/views/main/Documents/Original/Nursingplan/index.vue') },
          { path: 'Nursingrecord', name: 'Nursingrecord', component: () => import('@/views/main/Documents/Original/Nursingrecord/index.vue') },
          { path: 'PriceList', name: 'PriceList', component: () => import('@/views/main/Documents/Original/PriceList/index.vue') },
          { path: 'Pipeline', name: 'Pipeline', component: () => import('@/views/main/Documents/Original/Pipeline/index.vue') },
          { path: 'Inspectionreport', name: 'Inspectionreport', component: () => import('@/views/main/Documents/Original/Inspectionreport/index.vue') },
          { path: 'Spmsq', name: 'Spmsq', component: () => import('@/views/main/Documents/Original/Spmsq/index.vue') },
          { path: 'Hour72', name: 'Hour72', component: () => import('@/views/main/Documents/Original/Hour72/index.vue') },
          { path: 'Sociopsychological', name: 'Sociopsychological', component: () => import('@/views/main/Documents/Original/Sociopsychological/index.vue') },
          { path: 'Servicerecord', name: 'Servicerecord', component: () => import('@/views/main/Documents/Original/Servicerecord/index.vue') },
          { path: 'Adaptability', name: 'Adaptability', component: () => import('@/views/main/Documents/Original/Adaptability/index.vue') },
          { path: 'Treatment', name: 'Treatment', component: () => import('@/views/main/Documents/Original/Treatment/index.vue') },
          { path: 'Rehabilitation', name: 'Rehabilitation', component: () => import('@/views/main/Documents/Original/Rehabilitation/index.vue') },
          { path: 'Hour72Nutrition', name: 'Hour72Nutrition', component: () => import('@/views/main/Documents/Original/Hour72Nutrition/index.vue') },
          { path: 'Nutrition', name: 'Nutrition', component: () => import('@/views/main/Documents/Original/Nutrition/index.vue') },
          { path: 'Consultation', name: 'Consultation', component: () => import('@/views/main/Documents/Original/Consultation/index.vue') },

          // { path: 'recordlist', name: 'recordlist', component: resolve => require(['../views/document/RecordList.vue'], resolve) },
          // { path: 'adaptlist', name: 'adaptlist', component: resolve => require(['../views/document/AdaptList.vue'], resolve) },
          // { path: 'kblist', name: 'kblist', component: resolve => require(['../views/document/KbList.vue'], resolve) },
          // { path: 'falllist', name: 'falllist', component: resolve => require(['../views/document/FallList.vue'], resolve) },
          // { path: 'bradenlist', name: 'bradenlist', component: resolve => require(['../views/document/BradenList.vue'], resolve) },
          // { path: 'medicinerecordlist', name: 'medicinerecordlist', component: resolve => require(['../views/document/MedicineRecordList.vue'], resolve) },
          // { path: 'nursingassessment', name: 'nursingassessment', component: resolve => require(['../views/document/Nursingassessment.vue'], resolve) },
          // { path: 'melancholylist', name: 'melancholylist', component: resolve => require(['../views/document/MelancholyList.vue'], resolve) },
          // { path: 'pharmacistevaluationlist', name: 'pharmacistevaluationlist', component: resolve => require(['../views/document/PharmacistEvaluationList.vue'], resolve) },
          // { path: 'medicationevaluationlist', name: 'medicationevaluationlist', component: resolve => require(['../views/document/MedicationEvaluationList.vue'], resolve) },

          //衛服部專用表單
          { path: 'HealthyHabits', name: 'HealthyHabits', component: () => import('@/views/main/Documents/Mohw/HealthyHabits.vue') },
          { path: 'MedicalHistories', name: 'MedicalHistories', component: () => import('@/views/main/Documents/Mohw/MedicalHistories.vue') },
          { path: 'DrugSafeties', name: 'DrugSafeties', component: () => import('@/views/main/Documents/Mohw/DrugSafeties.vue') },
          { path: 'BodyEvaluations', name: 'BodyEvaluations', component: () => import('@/views/main/Documents/Mohw/BodyEvaluations.vue') },
          { path: 'PressureInjuries', name: 'PressureInjuries', component: () => import('@/views/main/Documents/Mohw/PressureInjuries.vue') },
          { path: 'FallRisks', name: 'FallRisks', component: () => import('@/views/main/Documents/Mohw/FallRisks.vue') },
          { path: 'ADLs', name: 'ADLs', component: () => import('@/views/main/Documents/Mohw/ADLs.vue') },
          { path: 'IADLs', name: 'IADLs', component: () => import('@/views/main/Documents/Mohw/IADLs.vue') },
          { path: 'Dementias', name: 'Dementias', component: () => import('@/views/main/Documents/Mohw/Dementias.vue') },
          { path: 'GeriatricDepressionScales', name: 'GeriatricDepressionScales', component: () => import('@/views/main/Documents/Mohw/GeriatricDepressionScales.vue') },
          { path: 'BSRS5s', name: 'BSRS5s', component: () => import('@/views/main/Documents/Mohw/BSRS5s.vue') },
          { path: 'MNASFs', name: 'MNASFs', component: () => import('@/views/main/Documents/Mohw/MNASFs.vue') },
          { path: 'PainEvaluations', name: 'PainEvaluations', component: () => import('@/views/main/Mohw/PainEvaluations.vue') },
          { path: 'SOFs', name: 'SOFs', component: () => import('@/views/main/Documents/Mohw/SOFs.vue') },

          { path: 'CaseSummaryPlan', name: 'CaseSummaryPlan', component: () => import('@/views/main/Documents/Original/mohw/CaseSummaryPlan.vue') },
          { path: 'CareRecord', name: 'CareRecord', component: () => import('@/views/main/Documents/Original/mohw/CareRecord.vue') },

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
  { path: '/NursingplanPrint', name: 'NursingplanPrint', component: () => import('@/views/main/Documents/Original/Nursingplan/PrintPage.vue') },
  { path: '/NursingrecordPrint', name: 'NursingrecordPrint', component: () => import('@/views/main/Documents/Original/Nursingrecord/PrintPage.vue') },
  { path: '/InspectionreportPrint', name: 'InspectionreportPrint', component: () => import('@/views/main/Documents/Original/Inspectionreport/PrintPage.vue') },
  { path: '/MultiDocumentPrint', name: 'MultiDocumentPrint', component: () => import('@/views/print/MultiDocumentPrint.vue') },
  { path: '/Hour72Print', name: 'Hour72Print', component: () => import('@/views/main/Documents/Original/Hour72/PrintPage.vue') },
  { path: '/SociopsychologicalPrint', name: 'SociopsychologicalPrint', component: () => import('@/views/main/Documents/Original/Sociopsychological/PrintPage.vue') },
  { path: '/ServicerecordPrint', name: 'ServicerecordPrint', component: () => import('@/views/main/Documents/Original/Servicerecord/PrintPage.vue') },
  { path: '/AdaptabilityPrint', name: 'AdaptabilityPrint', component: () => import('@/views/main/Documents/Original/Adaptability/PrintPage.vue') },
  { path: '/TreatmentPrint', name: 'TreatmentPrint', component: () => import('@/views/main/Documents/Original/Treatment/PrintPage.vue') },
  { path: '/RehabilitationPrint', name: 'RehabilitationPrint', component: () => import('@/views/main/Documents/Original/Rehabilitation/PrintPage.vue') },
  { path: '/Hour72NutritionPrint', name: 'Hour72NutritionPrint', component: () => import('@/views/main/Documents/Original/Hour72Nutrition/PrintPage.vue') },
  { path: '/NutritionPrintManage', name: 'NutritionPrintManage', component: () => import('@/views/main/Documents/Original/Nutrition/NutritionPrintManage.vue') },
  { path: '/NutritionMultiPrint', name: 'NutritionMultiPrint', component: () => import('@/views/main/Documents/Original/Nutrition/NutritionMultiPrint.vue') },
  { path: '/ConsultationPrint', name: 'ConsultationPrint', component: () => import('@/views/main/Documents/Original/Consultation/PrintPage.vue') },
  
  
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
