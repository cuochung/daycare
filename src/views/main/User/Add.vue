<template>
  <div class="pa-4 pb-6">
    <v-dialog v-model="dialog" fullscreen persistent>
      <template #activator="{ props }">
        <v-btn v-bind="props" class="add-record-btn" color="primary" variant="elevated" size="large"
          prepend-icon="mdi-plus-circle" rounded="pill" elevation="6" @click="addProcess" v-if="!isHidden">
          新增住民資料
        </v-btn>
      </template>

      <v-card rounded="xl" elevation="6">
        <FloatingPanel :title="'快速導覽'">
          <v-slide-y-transition>
            <v-sheet color="primary-lighten-5" variant="tonal" elevation="8">
              <div class="d-flex flex-column pa-2" style="gap: 8px;">
                <v-btn v-for="anchor in sectionAnchors" :key="anchor.id" color="primary" variant="tonal" size="small"
                  block @click="scrollToSection(anchor.id)">
                  {{ anchor.label }}
                </v-btn>

                <v-divider></v-divider>

                <v-btn color="error" variant="tonal" size="small" block @click="dialog = false">
                  關閉
                </v-btn>
                <v-btn color="primary" variant="flat" @click="addOK" v-if="processType == 'add'">
                  確認新增
                </v-btn>
                <v-btn color="success" variant="flat" @click="editOK" v-if="processType == 'edit'">
                  確認修改
                </v-btn>
              </div>
            </v-sheet>
          </v-slide-y-transition>
        </FloatingPanel>

        <v-sheet :color="titleColor" class="d-flex align-center px-6 py-4" rounded="t-xl" elevation="0">
          <span class="text-h6 font-weight-bold text-white">{{ title }}</span>
          <v-spacer></v-spacer>

          <v-switch label="Hidden" class="ml-4 text-white" color="white" density="comfortable" hide-details
            base-color="white" v-model="list.hidden" true-value="true" false-value=""></v-switch>

          <v-btn icon="mdi-close" class="ml-2" variant="text" color="white" @click="dialog = false"></v-btn>
        </v-sheet>

        <v-card-text class="mt-3">
          <!-- 表單內容 -->
          <v-form ref="form">
            <!-- 個人基本資料 -->
            <v-card id="section-personal" variant="outlined" rounded="lg" elevation="1" class="mb-6">
              <v-card-title class="d-flex align-center py-4">
                <v-avatar size="44" color="primary" variant="tonal" class="mr-4">
                  <v-icon color="primary" size="28">mdi-card-account-details-outline</v-icon>
                </v-avatar>
                <div class="d-flex flex-column">
                  <span class="text-subtitle-1 font-weight-bold text-primary">個人基本資料</span>
                  <span class="text-body-2 text-medium-emphasis">基本身分與入住資訊設定</span>
                </div>
              </v-card-title>
              <v-divider></v-divider>

              <v-card-text class="pt-6">
                <v-row>
                  <v-col cols="12" md="9">
                    <v-row>
                      <v-col cols="12" sm="4">
                        <v-text-field label="病歷號" v-model="list.p_code" :rules="emptyRules" variant="outlined"
                          ref="p_code" :readonly="processType == 'add'"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-text-field label="姓名" v-model="list.name" :rules="emptyRules" autofocus
                          variant="outlined"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-select :items="sexitems" label="性別" v-model="list.sex" variant="outlined"></v-select>
                      </v-col>
                      <v-col cols="12" sm="2">
                        <v-checkbox label="公費資格" v-model="list.publicexpenses" true-value="true" false-value=""
                          hide-details></v-checkbox>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-text-field label="公費資格內容" v-model="list.publicexpenses_content"
                          variant="outlined"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="2">
                        <v-checkbox label="DNR" v-model="list.dnr" true-value="true" false-value=""
                          hide-details></v-checkbox>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-text-field label="DNR內容" v-model="list.dnr_content" variant="outlined"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="3">
                        <v-text-field type="date" label="入住日期" v-model="list.in_date" variant="outlined"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="3" class="d-flex align-center">
                        <v-text-field type="date" label="退住日期" v-model="list.out_date"
                          variant="outlined"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="3" class="d-flex align-center">
                        <v-text-field type="date"
                          :label="'出生日期 年齡：' + (list.birthday != '0000-00-00' ? age() : '') + ' 歲'"
                          v-model="list.birthday" variant="outlined"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="3" class="d-flex align-center">
                        <v-text-field :label="`身分證字號${idEdit ? '(鎖定)' : '(可修改)'}`" v-model="list.id_num" counter="10"
                          variant="outlined" :readonly="idEdit && processType == 'edit'"></v-text-field>
                        <v-btn color="secondary" variant="tonal" size="small" @click.stop="idEdit = false"
                          v-if="processType == 'edit'">
                          修改
                        </v-btn>
                      </v-col>
                      <v-col cols="12" sm="3">
                        <v-select :items="sourceitems" label="入住來源" v-model="list.source" variant="outlined"></v-select>
                      </v-col>
                      <v-col cols="12" sm="3">
                        <v-text-field label="入住來源-其他內容" v-model="list.source_content" variant="outlined"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="3">
                        <v-select :items="enterfnitems" label="入院方式" v-model="list.enterfn"
                          variant="outlined"></v-select>
                      </v-col>
                      <v-col cols="12" sm="3">
                        <v-text-field label="入院方式-其他內容" v-model="list.enterfn_content"
                          variant="outlined"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" md="3">
                    <input type="file" ref="fileInput" @change="onFileSelected" style="display:none" />
                    <v-card color="primary-lighten-5" variant="tonal" elevation="0" rounded="lg"
                      class="pa-4 d-flex flex-column align-center">
                      <v-icon color="primary" size="32" class="mb-2">mdi-account-box-outline</v-icon>
                      <span class="text-subtitle-2 text-primary mb-4">個人照片</span>

                      <div class="w-100">
                        <v-sheet v-if="uploadImage.preview" color="white" rounded="lg"
                          class="d-flex align-center justify-center pa-2">
                          <v-img :src="uploadImage.preview" aspect-ratio="1" rounded="lg" cover>
                            <v-overlay absolute :model-value="uploading" class="d-flex align-center justify-center">
                              <v-progress-circular color="primary" indeterminate size="32"></v-progress-circular>
                            </v-overlay>
                          </v-img>
                        </v-sheet>

                        <v-sheet v-else-if="hasExistingPhoto" color="white" rounded="lg"
                          class="d-flex align-center justify-center pa-2">
                          <v-img :src="`${baseUrl}/upload/${databaseName}/${list.picInfo.picName}`"
                            :lazy-src="`${baseUrl}/upload/${databaseName}/${defaultPicName}`" aspect-ratio="1"
                            rounded="lg" cover>
                            <template #placeholder>
                              <v-row class="fill-height ma-0" align="center" justify="center">
                                <v-progress-circular color="primary" indeterminate size="32"></v-progress-circular>
                              </v-row>
                            </template>
                            <v-overlay absolute :model-value="uploading" class="d-flex align-center justify-center">
                              <v-progress-circular color="primary" indeterminate size="32"></v-progress-circular>
                            </v-overlay>
                          </v-img>
                        </v-sheet>

                        <v-sheet v-else color="white" rounded="lg"
                          class="d-flex flex-column align-center justify-center pa-6" style="min-height: 220px;">
                          <v-icon color="primary" size="36" class="mb-2">mdi-image-off-outline</v-icon>
                          <span class="text-body-2 text-medium-emphasis">未上傳任何照片</span>
                        </v-sheet>
                      </div>

                      <v-card-actions class="mt-4 d-flex flex-column w-100" style="gap: 8px;">
                        <template v-if="uploadImage.preview">
                          <v-btn color="primary" variant="flat" prepend-icon="mdi-cloud-upload" block
                            @click.stop="goUploadThumb" :loading="uploading">
                            重新選擇
                          </v-btn>
                          <v-btn color="secondary" variant="tonal" prepend-icon="mdi-close-circle" block
                            @click.stop="clearUploadPreview">
                            取消預覽
                          </v-btn>
                        </template>
                        <template v-else-if="hasExistingPhoto">
                          <v-btn color="primary" variant="flat" prepend-icon="mdi-cloud-upload" block
                            @click.stop="goUploadThumb" :loading="uploading">
                            重新上傳
                          </v-btn>
                          <v-btn color="error" variant="tonal" prepend-icon="mdi-delete-outline" block
                            @click.stop="removeExistingPhoto">
                            刪除照片
                          </v-btn>
                        </template>
                        <template v-else>
                          <v-btn color="primary" variant="flat" prepend-icon="mdi-cloud-upload" block
                            @click.stop="goUploadThumb" :loading="uploading">
                            選擇照片
                          </v-btn>
                        </template>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- 身分福利別 -->
            <v-card v-if="list.Welfare" id="section-welfare" variant="outlined" rounded="lg" elevation="1" class="mb-6">
              <v-card-title class="d-flex align-center py-4">
                <v-avatar size="40" color="secondary" variant="tonal" class="mr-4">
                  <v-icon color="secondary" size="24">mdi-account-heart-outline</v-icon>
                </v-avatar>
                <div class="d-flex flex-column">
                  <span class="text-subtitle-1 font-weight-bold text-secondary">身分福利別</span>
                  <span class="text-body-2 text-medium-emphasis">維護身分福利與證明資訊</span>
                </div>
              </v-card-title>
              <v-divider></v-divider>

              <v-card-text class="pt-6">
                <div class="d-flex flex-wrap">
                  <v-select :items="['無', '有']" label="重大傷病證明" v-model="list.Welfare.MajorIllnessCert.Value"
                    :rules="emptyRules" variant="outlined" density="comfortable" class="mr-4 mb-4"></v-select>
                  <v-text-field v-if="list.Welfare.MajorIllnessCert.Value == '有'" label="說明"
                    v-model="list.Welfare.MajorIllnessCert.Other" :rules="emptyRules" variant="outlined"
                    class="mr-4 mb-4"></v-text-field>
                </div>

                <div class="d-flex flex-wrap mt-4">
                  <v-select :items="DisabilityCertItems" label="身心障礙證明" v-model="list.Welfare.DisabilityCert.Value"
                    :rules="emptyRules" variant="outlined" density="comfortable" class="mr-4 mb-4"></v-select>
                  <v-select v-if="list.Welfare.DisabilityCert.Value != '無'" label="身心障礙類別"
                    :items="DisabilityCertOtherItems" v-model="list.Welfare.DisabilityCert.Other" :rules="emptyRules"
                    multiple variant="outlined" density="comfortable" class="mr-4 mb-4"></v-select>
                </div>
              </v-card-text>
            </v-card>

            <!-- 障礙設定 -->
            <v-card id="section-obstacle" variant="outlined" rounded="lg" elevation="1" class="mb-6">
              <v-card-title class="d-flex align-center py-4">
                <v-avatar size="40" color="primary" variant="tonal" class="mr-4">
                  <v-icon color="primary" size="24">mdi-wheelchair-accessibility</v-icon>
                </v-avatar>
                <div class="d-flex flex-column">
                  <span class="text-subtitle-1 font-weight-bold text-primary">障礙設定</span>
                  <span class="text-body-2 text-medium-emphasis">設定與維護障礙等級與有效期限</span>
                </div>
              </v-card-title>
              <v-divider></v-divider>

              <v-card-text class="pt-6">
                <v-row>
                  <v-col cols="12" sm="3">
                    <v-select :items="obstacleItems" label="障礙類別" v-model="list.obstacleInput.kind"
                      variant="outlined"></v-select>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-select :items="obstaclelvItems" label="障礙等級" v-model="list.obstacleInput.lv"
                      variant="outlined"></v-select>
                  </v-col>
                  <v-col cols="12" sm="2" class="d-flex align-center">
                    <v-text-field type="date" label="到期日" v-model="list.obstacleInput.date"
                      variant="outlined"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="2">
                    <v-btn color="primary" block variant="flat" @click="addObstacle">新增障礙設定</v-btn>
                  </v-col>
                  <v-col cols="12" sm="2">
                    <v-btn color="secondary" block variant="flat" @click="addObstacle('forever')">新增障礙設定(無限期)</v-btn>
                  </v-col>
                  <v-col cols="12">
                    <div class="d-flex align-center flex-wrap">
                      <span class="mr-4">已設定內容:</span>
                      <v-chip v-for="(oitem, index) in list.obstacleArr" :key="index" class="ma-2" color="primary"
                        variant="tonal">
                        {{ oitem.kind }} - {{ oitem.lv }} - {{ oitem.date }}
                        <v-icon size="16" color="error" @click.stop="delObstacle(index)">mdi-close</v-icon>
                      </v-chip>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- 語言與婚姻資訊 -->
            <v-card id="section-language" variant="outlined" rounded="lg" elevation="1" class="mb-6">
              <v-card-title class="d-flex align-center py-4">
                <v-avatar size="40" color="secondary" variant="tonal" class="mr-4">
                  <v-icon color="secondary" size="24">mdi-account-voice</v-icon>
                </v-avatar>
                <div class="d-flex flex-column">
                  <span class="text-subtitle-1 font-weight-bold text-secondary">語言與婚姻資訊</span>
                  <span class="text-body-2 text-medium-emphasis">記錄日常溝通偏好與婚姻狀態</span>
                </div>
              </v-card-title>

              <v-card-text class="pt-6">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-card variant="outlined" color="primary-lighten-5" rounded="lg" class="pa-5 mb-6">
                      <v-card-title class="d-flex align-center pa-0 mb-3">
                        <v-icon color="primary" class="mr-2">mdi-translate</v-icon>
                        <span class="text-subtitle-1 font-weight-bold text-primary">語言</span>
                        <v-spacer></v-spacer>
                        <span class="text-caption text-medium-emphasis">選擇可溝通語言</span>
                      </v-card-title>
                      <v-select v-model="list.languages" :items="languageOptions" label="可溝通語言" variant="outlined"
                        :rules="emptyObjRules" density="comfortable" multiple chips closable-chips hint="可複選"
                        persistent-hint></v-select>
                      <v-text-field v-if="list.languages && list.languages.includes('其他')" label="其他語言說明"
                        v-model="list.language8" variant="outlined" class="mt-4"></v-text-field>
                    </v-card>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-card variant="outlined" color="secondary-lighten-5" rounded="lg" class="pa-5 mb-6">
                      <v-card-title class="d-flex align-center pa-0 mb-3">
                        <v-icon color="primary" class="mr-2">mdi-heart-outline</v-icon>
                        <span class="text-subtitle-1 font-weight-bold text-secondary">婚姻狀況</span>
                        <v-spacer></v-spacer>
                        <span class="text-caption text-medium-emphasis">至少選擇一項</span>
                      </v-card-title>
                      <v-select v-model="list.marriageStatuses" :items="marriageOptions" label="婚姻狀態" variant="outlined"
                        density="comfortable" multiple chips closable-chips hint="可複選" persistent-hint
                        :rules="emptyObjRules"></v-select>
                      <v-text-field v-if="list.marriageStatuses && list.marriageStatuses.includes('其他')"
                        label="其他婚姻狀況說明" v-model="list.marry7" variant="outlined" class="mt-4"></v-text-field>
                    </v-card>
                  </v-col>


                  <v-col cols="12" md="6">
                    <v-card variant="outlined" rounded="lg" class="pa-4 h-100">
                      <v-card-title class="pa-0 mb-3 d-flex align-center">
                        <v-icon color="primary" class="mr-2">mdi-hands-pray</v-icon>
                        <span class="text-subtitle-1 font-weight-bold">宗教信仰</span>
                      </v-card-title>
                      <v-select :items="faithitems" label="宗教信仰" v-model="list.faith" variant="outlined"
                        density="comfortable"></v-select>
                    </v-card>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-card variant="outlined" rounded="lg" class="pa-4 h-100">
                      <v-card-title class="pa-0 mb-3 d-flex align-center">
                        <v-icon color="primary" class="mr-2">mdi-heart-pulse</v-icon>
                        <span class="text-subtitle-1 font-weight-bold">身體狀況</span>
                      </v-card-title>
                      <v-row>
                        <v-col cols="12" sm="6">
                          <v-text-field label="身高" suffix="cm" v-model="list.height" variant="outlined"
                            density="comfortable"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field label="體重" suffix="kg" v-model="list.weight" variant="outlined"
                            density="comfortable"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-card variant="outlined" rounded="lg" class="pa-4 h-100">
                      <v-card-title class="pa-0 mb-3 d-flex align-center">
                        <v-icon color="primary" class="mr-2">mdi-hospital-building</v-icon>
                        <span class="text-subtitle-1 font-weight-bold">就醫資訊</span>
                      </v-card-title>
                      <v-text-field label="平日就醫地點" v-model="list.usual_hospital" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-card>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-card variant="outlined" rounded="lg" class="pa-4 h-100">
                      <v-card-title class="pa-0 mb-3 d-flex align-center">
                        <v-icon color="primary" class="mr-2">mdi-briefcase-check-outline</v-icon>
                        <span class="text-subtitle-1 font-weight-bold">保管物品</span>
                      </v-card-title>
                      <v-text-field label="保管物品" v-model="list.keepthings" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- 連絡人資料 -->
            <v-card id="section-contacts" variant="outlined" rounded="lg" elevation="1" class="mb-6">
              <v-card-title class="d-flex align-center py-4">
                <v-avatar size="40" color="primary" variant="tonal" class="mr-4">
                  <v-icon color="primary" size="24">mdi-account-multiple</v-icon>
                </v-avatar>
                <div class="d-flex flex-column">
                  <span class="text-subtitle-1 font-weight-bold text-primary">連絡人資料</span>
                  <span class="text-body-2 text-medium-emphasis">維護緊急聯絡人與聯絡方式</span>
                </div>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="flat" size="small" prepend-icon="mdi-account-plus" @click="newContact">
                  新增聯絡人
                </v-btn>
              </v-card-title>
              <v-divider></v-divider>

              <v-card-text class="pt-6">
                <v-row dense>
                  <v-col cols="12" md="6" v-for="(contact, index) in list.contactMan" :key="index">
                    <v-sheet color="primary-lighten-5" variant="tonal" rounded="lg" class="pa-4 h-100">
                      <div class="d-flex align-center mb-3">
                        <div>
                          <div class="text-subtitle-2 font-weight-bold text-primary">聯絡人 {{ index + 1 }}</div>
                          <div class="text-caption text-medium-emphasis">填寫緊急聯絡人資訊</div>
                        </div>
                        <v-spacer></v-spacer>
                        <v-btn icon variant="text" color="error" @click="delContact(index)">
                          <v-icon>mdi-delete-outline</v-icon>
                        </v-btn>
                      </div>

                      <v-row dense>
                        <v-col cols="12" sm="6">
                          <v-text-field label="姓名" v-model="contact.man" variant="outlined"
                            prepend-icon="mdi-account"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field label="關係" v-model="contact.relationship" variant="outlined"
                            prepend-icon="mdi-account-heart-outline"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field label="電話" v-model="contact.phone" variant="outlined" type="tel"
                            prepend-icon="mdi-phone"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field label="地址" v-model="contact.address" variant="outlined"
                            prepend-icon="mdi-home-map-marker"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-sheet>
                  </v-col>
                </v-row>
              </v-card-text>

            </v-card>

            <!-- 入院護理評估 -->
            <v-card id="section-nursing" variant="outlined" rounded="lg" elevation="1" class="mb-6">
              <v-card-title class="d-flex align-center py-4">
                <v-avatar size="40" color="primary" variant="tonal" class="mr-4">
                  <v-icon color="primary" size="24">mdi-file-document-edit</v-icon>
                </v-avatar>
                <div class="d-flex flex-column">
                  <span class="text-subtitle-1 font-weight-bold text-primary">入院護理評估</span>
                  <span class="text-body-2 text-medium-emphasis">整合護理評估資訊</span>
                </div>
              </v-card-title>
              <v-divider></v-divider>

              <v-card-text class="pt-6">
                <v-sheet color="primary-lighten-5" variant="tonal" rounded="lg" class="pa-5 mb-8">
                  <h3 class="text-subtitle-1 font-weight-bold text-primary mb-4">社經地位評估</h3>
                  <v-row dense>
                    <v-col cols="12" md="6">
                      <v-select v-model="list.nursingAssessment.identity" :items="identityOptions" label="身分"
                        variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field label="身分其他內容" v-model="list.nursingAssessment.identityOther" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select v-model="list.nursingAssessment.education" :items="educationOptions" label="教育"
                        variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select v-model="list.nursingAssessment.occupation" :items="occupationOptions" label="職業"
                        variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>
                  </v-row>
                </v-sheet>

                <v-sheet color="primary-lighten-5" variant="tonal" rounded="lg" class="pa-5 mb-8">
                  <h3 class="text-subtitle-1 font-weight-bold text-primary mb-4">日常生活習慣</h3>
                  <v-row dense>
                    <v-col cols="12">飲食</v-col>
                    <v-col cols="12">
                      <v-row dense>
                        <v-col cols="12" md="6">
                          <v-select v-model="list.nursingAssessment.dietTypes" :items="dietTypeOptions" label="飲食種類"
                            variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="飲食種類其他內容" v-model="list.nursingAssessment.dietTypesOther"
                            variant="outlined" density="comfortable"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                          <v-select v-model="list.nursingAssessment.dietTextures" :items="dietTextureOptions"
                            label="飲食型態" variant="outlined" multiple chips closable-chips
                            density="comfortable"></v-select>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="飲食型態其他內容" v-model="list.nursingAssessment.dietTexturesOther"
                            variant="outlined" density="comfortable"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                          <v-select v-model="list.nursingAssessment.dietRoutes" :items="dietRouteOptions" label="進食途徑"
                            variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                        </v-col>
                        <v-col cols="12" md="6"></v-col>

                        <v-col cols="12" md="6">
                          <v-select v-model="list.nursingAssessment.dietPreference" :items="dietPreferenceOptions"
                            label="飲食偏好" variant="outlined" multiple chips closable-chips
                            density="comfortable"></v-select>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="飲食偏好其他內容" v-model="list.nursingAssessment.dietPreferenceOther"
                            variant="outlined" density="comfortable"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                          <v-select v-model="list.nursingAssessment.dietTaboo" :items="dietTabooOptions" label="飲食禁忌"
                            variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field label="飲食禁忌其他內容" v-model="list.nursingAssessment.dietTabooOther"
                            variant="outlined" density="comfortable"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12">
                      <v-divider class="my-6"></v-divider>
                    </v-col>

                    <v-col cols="12">睡眠</v-col>

                    <v-col cols="12" md="6">
                      <v-select v-model="list.nursingAssessment.sleepSpirit" :items="sleepSpiritOptions" label="白天精神"
                        variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select v-model="list.nursingAssessment.sleepPattern" :items="sleepPatternOptions" label="睡眠型態"
                        variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field label="睡眠時間 (小時/天)" v-model="list.nursingAssessment.sleepHours" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field label="睡眠使用藥物" v-model="list.nursingAssessment.sleepMedication" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field label="睡眠其他" v-model="list.nursingAssessment.sleepOther" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <v-divider class="my-6"></v-divider>
                    </v-col>
                    <v-col cols="12">排便</v-col>

                    <v-col cols="12" md="6">
                      <v-select v-model="list.nursingAssessment.bowelCondition" :items="bowelConditionOptions"
                        label="排便情形" variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select v-model="list.nursingAssessment.bowelFrequency" :items="bowelFrequencyOptions"
                        label="排便時間" variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field label="排便天數" v-model="list.nursingAssessment.bowelDays" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field label="排便次數" v-model="list.nursingAssessment.bowelTimes" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select v-model="list.nursingAssessment.bowelMethod" :items="bowelMethodOptions" label="解便型式"
                        variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select v-model="list.nursingAssessment.bowelAid" :items="bowelAidOptions" label="排便型態"
                        variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-select v-model="list.nursingAssessment.urineCondition" :items="urineConditionOptions"
                        label="排尿情形" variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select v-model="list.nursingAssessment.urineAppearance" :items="urineAppearanceOptions"
                        label="尿液性狀" variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select v-model="list.nursingAssessment.urineMethod" :items="urineMethodOptions" label="排尿型態"
                        variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>

                    <v-col cols="12">
                      <v-divider class="my-6"></v-divider>
                    </v-col>
                    <v-col cols="12">活動</v-col>

                    <v-col cols="12" md="4">
                      <v-select v-model="list.nursingAssessment.activityAbility" :items="activityAbilityOptions"
                        label="活動能力" variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-select v-model="list.nursingAssessment.gait" :items="gaitOptions" label="步態" variant="outlined"
                        multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field label="步態其他" v-model="list.nursingAssessment.gaitOther" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <h4 class="text-subtitle-2 font-weight-bold mb-2 text-primary">日常生活分級(請填1.2.3.(1.獨立自主2.需協助3.完全依賴))
                      </h4>
                      <v-row dense>
                        <v-col cols="12" sm="4" md="2">
                          <v-text-field label="梳洗" v-model="list.nursingAssessment.adlGrooming"
                            variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4" md="2">
                          <v-text-field label="進食" v-model="list.nursingAssessment.adlEating"
                            variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4" md="2">
                          <v-text-field label="更衣" v-model="list.nursingAssessment.adlDressing"
                            variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4" md="2">
                          <v-text-field label="沐浴" v-model="list.nursingAssessment.adlBathing"
                            variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4" md="2">
                          <v-text-field label="如廁" v-model="list.nursingAssessment.adlToileting"
                            variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4" md="2">
                          <v-text-field label="移位" v-model="list.nursingAssessment.adlTransfer"
                            variant="outlined"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col cols="12">
                      <v-divider class="my-6"></v-divider>
                    </v-col>
                    <v-col cols="12">跌倒</v-col>

                    <v-col cols="12" md="3">
                      <v-select v-model="list.nursingAssessment.fallFrequency" :items="fallFrequencyOptions"
                        label="跌倒情況" variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-select v-model="list.nursingAssessment.fallLastYear" :items="fallLastYearOptions"
                        label="近一年是否跌倒" variant="outlined" multiple chips closable-chips
                        density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-select v-model="list.nursingAssessment.fallLocation" :items="fallLocationOptions" label="跌倒發生處"
                        variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field label="跌倒發生處其他" v-model="list.nursingAssessment.fallLocationOther"
                        variant="outlined" density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-select v-model="list.nursingAssessment.fallInjury" :items="fallInjuryOptions" label="跌倒是否受傷"
                        variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field label="受傷部位" v-model="list.nursingAssessment.fallInjuryPart" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field label="當時受傷情形" v-model="list.nursingAssessment.fallInjuryDetail" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <v-divider class="my-6"></v-divider>
                    </v-col>
                    <v-col cols="12">菸酒</v-col>

                    <v-col cols="12" md="3">
                      <v-select v-model="list.nursingAssessment.smoking" :items="smokingOptions" label="抽菸情形"
                        variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>

                    <v-col cols="12" md="3">
                      <v-text-field label="每日抽菸 (包)" v-model="list.nursingAssessment.smokingDailyAmount"
                        variant="outlined" density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field label="已抽菸 (年)" v-model="list.nursingAssessment.smokingYears" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field label="戒菸 (年)" v-model="list.nursingAssessment.smokingQuitYears" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-select v-model="list.nursingAssessment.drinking" :items="drinkingOptions" label="喝酒情形"
                        variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field label="飲酒每日量" v-model="list.nursingAssessment.drinkingDailyAmount"
                        variant="outlined" density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field label="飲酒種類" v-model="list.nursingAssessment.drinkingType" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <v-divider class="my-6"></v-divider>
                    </v-col>
                    <v-col cols="12">休閒活動</v-col>

                    <v-col cols="12" md="6">
                      <v-select v-model="list.nursingAssessment.leisureActivities" :items="leisureOptions" label="休閒活動"
                        variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field label="休閒活動其他" v-model="list.nursingAssessment.leisureOther" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-col>
                  </v-row>
                </v-sheet>

                <v-sheet color="primary-lighten-5" variant="tonal" rounded="lg" class="pa-5">
                  <h3 class="text-subtitle-1 font-weight-bold text-primary mb-4">一般狀況評估</h3>
                  <v-row dense>
                    <v-col cols="12" md="4">
                      <v-select v-model="list.nursingAssessment.appearance" :items="appearanceOptions" label="一般外觀"
                        variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-select v-model="list.nursingAssessment.emotion" :items="emotionOptions" label="情緒狀態"
                        variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field label="情緒其他" v-model="list.nursingAssessment.emotionOther" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-select v-model="list.nursingAssessment.nerve" :items="nerveOptions" label="神經系統"
                        variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field label="痛 (部位)" v-model="list.nursingAssessment.nervePain" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field label="麻 (部位)" v-model="list.nursingAssessment.nerveNumb" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field label="無知覺 (部位)" v-model="list.nursingAssessment.nerveNoSensation"
                        variant="outlined" density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field label="抽搐 (部位)" v-model="list.nursingAssessment.nerveConvulsion" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-select v-model="list.nursingAssessment.skin" :items="skinOptions" label="皮膚狀況"
                        variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field label="皮膚其他" v-model="list.nursingAssessment.skinOther" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-select v-model="list.nursingAssessment.senses" :items="sensesOptions" label="感官知覺"
                        variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field label="感官其他" v-model="list.nursingAssessment.sensesOther" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-select v-model="list.nursingAssessment.respiratory" :items="respiratoryOptions" label="呼吸系統"
                        variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field label="呼吸其他" v-model="list.nursingAssessment.respiratoryOther" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-select v-model="list.nursingAssessment.sputum" :items="sputumOptions" label="痰"
                        variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field label="痰顏色" v-model="list.nursingAssessment.sputumColor" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field label="痰量" v-model="list.nursingAssessment.sputumAmount" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field label="痰性質" v-model="list.nursingAssessment.sputumNature" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-select v-model="list.nursingAssessment.cardiovascular" :items="cardiovascularOptions"
                        label="心臟血管系統" variant="outlined" multiple chips closable-chips
                        density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field label="心臟血管其他" v-model="list.nursingAssessment.cardiovascularOther"
                        variant="outlined" density="comfortable"></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-select v-model="list.nursingAssessment.gastrointestinal" :items="gastrointestinalOptions"
                        label="腸胃系統" variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field label="腸胃其他" v-model="list.nursingAssessment.gastrointestinalOther"
                        variant="outlined" density="comfortable"></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-select v-model="list.nursingAssessment.urinary" :items="urinaryOptions" label="泌尿系統"
                        variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field label="泌尿其他" v-model="list.nursingAssessment.urinaryOther" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-select v-model="list.nursingAssessment.reproductiveFemale" :items="reproductiveFemaleOptions"
                        label="生殖系統 - 女" variant="outlined" multiple chips closable-chips
                        density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field label="生殖系統 - 女 其他" v-model="list.nursingAssessment.reproductiveFemaleOther"
                        variant="outlined" density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select v-model="list.nursingAssessment.reproductiveMale" :items="reproductiveMaleOptions"
                        label="生殖系統 - 男" variant="outlined" multiple chips closable-chips
                        density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field label="生殖系統 - 男 其他" v-model="list.nursingAssessment.reproductiveMaleOther"
                        variant="outlined" density="comfortable"></v-text-field>
                    </v-col>

                    <v-col cols="12" md="3">
                      <v-select v-model="list.nursingAssessment.skeletal" :items="skeletalOptions" label="骨骼肌肉系統"
                        variant="outlined" multiple chips closable-chips density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field label="骨骼肌肉其他" v-model="list.nursingAssessment.skeletalOther" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field label="骨折 (部位)" v-model="list.nursingAssessment.skeletalFracture" variant="outlined"
                        density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field label="截肢 (部位)" v-model="list.nursingAssessment.skeletalAmputation"
                        variant="outlined" density="comfortable"></v-text-field>
                    </v-col>
                  </v-row>
                </v-sheet>
              </v-card-text>
            </v-card>

            <!-- 訪視設定 -->
            <v-card id="section-visit" variant="outlined" rounded="lg" elevation="1">
              <v-card-title class="d-flex align-center py-4">
                <v-avatar size="40" color="secondary" variant="tonal" class="mr-4">
                  <v-icon color="secondary" size="24">mdi-account-group-outline</v-icon>
                </v-avatar>
                <div class="d-flex flex-column">
                  <span class="text-subtitle-1 font-weight-bold text-secondary">訪視設定</span>
                  <span class="text-body-2 text-medium-emphasis">設定訪客限制與備註內容</span>
                </div>
              </v-card-title>
              <v-divider></v-divider>

              <v-card-text class="pt-6">
                <v-checkbox v-model="list.visitLimit" label="限制訪客" hide-details></v-checkbox>
                <v-textarea v-model="list.visitLimitContent" label="限制內容" v-show="list.visitLimit"
                  variant="outlined"></v-textarea>
              </v-card-text>
            </v-card>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="flat" @click="addOK" v-if="processType == 'add'">
            確認新增
          </v-btn>
          <v-btn color="success" variant="flat" @click="editOK" v-if="processType == 'edit'">
            確認修改
          </v-btn>
        </v-card-actions>
        <!-- <pre>{{list}}</pre> -->
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import dayjs from 'dayjs'
import { useStore } from '@/stores/useStore'
import api from '@/assets/js/api'
import FloatingPanel from '@/components/FloatingPanel.vue' //浮動功能的組件；放到中間的內容就會有浮動拖曳效果

const store = useStore()
const emit = defineEmits(['getAllData'])

const props = defineProps({
  isHidden: { type: Boolean, default: false },
});

const dialog = ref(false)
const form = ref(null)
const fileInput = ref(null)
// const floatingPanel = ref(null)
const uploadImage = reactive({ // 上傳的圖片資訊
  file: null,
  preview: ''
})
const defaultPicName = 'lazypic.jpg'
const databaseName = 'user'


const processType = ref('')
const title = ref('')
const titleColor = ref('primary')

const emptyRules = [(v) => !!v || '不可空白']
const emptyObjRules = [v => Boolean(Object.keys(v || {})[0]) || "不可空白"]

const disabled = ref(true)
const loading = ref(false)
const uploading = ref(false)
const idEdit = ref(true)

const sexitems = ['男', '女']
const sourceitems = ['自由登記', '醫院轉介', '家屬介紹', '社衛政轉介', '其他']
const enterfnitems = ['步行', '輪椅', '扶持', '其他']
const faithitems = ['佛教', '道教', '回教', '基督教', '天主教', '其他']
const obstacleItems = ['第一類', '第二類', '第三類', '第四類', '第五類', '第六類', '第七類', '第八類']
const obstaclelvItems = ['輕度', '中度', '重度', '極重度']

const identityOptions = ['一般', '中低收入戶', '低收入戶(一款)', '低收入戶(二款)', '低收入戶(三款)', '原住民', '榮民(榮眷)']
const educationOptions = ['不識字', '國小以下', '小學', '國中', '高中(職)', '大學/大專', '大學以上', '不確定']
const occupationOptions = ['公', '商', '工', '教', '農', '自由業', '其他']
const dietTypeOptions = ['葷食', '早素', '初一、十五早素', '初一、十五全素']
const dietTextureOptions = ['普通', '軟質', '細碎', '半流質', '全流質', '管灌', '素食']
const dietRouteOptions = ['由口進食', '鼻胃管灌食', '胃造廔進食']
const dietPreferenceOptions = ['無', '奶蛋類', '肉類', '蔬菜', '海鮮', '其他']
const dietTabooOptions = ['無', '乳製品', '蛋類', '牛肉', '麩質', '海鮮', '其他']
const sleepSpiritOptions = ['佳', '偶爾打瞌睡', '倦怠', '嗜睡']
const sleepPatternOptions = ['正常', '早睡', '不易入睡', '斷續睡眠', '日夜顛倒']
const bowelConditionOptions = ['正常', '失禁', '便秘', '腹瀉', '造廔口-迴腸', '造廔口-空腸', '造廔口-結腸']
const bowelFrequencyOptions = ['每日一次', '每兩日一次', '不一定']
const bowelMethodOptions = ['廁所', '便盆', '尿布']
const bowelAidOptions = ['自解', '灌腸', '指挖', '塞劑', '口服用藥']
const urineConditionOptions = ['正常', '排尿困難', '頻尿', '滴尿', '導尿管', '失禁']
const urineAppearanceOptions = ['清澈', '混濁', '血尿', '沉澱物']
const urineMethodOptions = ['廁所', '尿壺', '便盆椅', '尿套', '紙尿褲', '導尿管-單導', '導尿管-存留', '膀胱造廔']
const activityAbilityOptions = ['正常', '減退']
const gaitOptions = ['穩定', '不穩定', '無法站立', '不自主運動']
const fallFrequencyOptions = ['經常跌倒', '偶爾跌倒', '無']
const fallLastYearOptions = ['有', '無']
const fallLocationOptions = ['家中', '機構']
const fallInjuryOptions = ['無', '有']
const smokingOptions = ['無', '有']
const drinkingOptions = ['不喝', '偶爾喝', '每天喝']
const leisureOptions = ['電視', '電影', '音樂', '閱讀', '繪畫']
const appearanceOptions = ['衣著適當', '衣著異常', '肥胖', '瘦']
const emotionOptions = ['平靜', '焦慮', '憂鬱', '冷漠', '愉快', '激動', '躁動不安']
const nerveOptions = ['正常', '暈眩感', '頸部僵硬']
const skinOptions = ['正常', '乾燥', '水腫', '黃疸', '發紺', '腫塊', '傷口', '疹']
const sensesOptions = [
  '正常',
  '視力障礙(左)',
  '視力障礙(右)',
  '偏盲',
  '聽力障礙(左)',
  '聽力障礙(右)',
  '耳鳴(左)',
  '耳鳴(右)',
  '嗅覺喪失',
  '味覺喪失'
]
const respiratoryOptions = ['正常', '淺快', '深快', '徐緩', '呼吸不規則', '端坐呼吸', '呼吸困難', '咳嗽']
const sputumOptions = ['無', '有(能自咳)', '有(需抽痰)']
const cardiovascularOptions = ['正常', '心律不整', '心悸', '胸悶', '杵狀指', '血壓高']
const gastrointestinalOptions = [
  '正常',
  '食慾增加',
  '食慾減少',
  '咀嚼困難',
  '吞嚥困難',
  '噁心',
  '嘔吐',
  '腹脹',
  '胃不適',
  '腹水',
  '體重改變',
  '便秘',
  '腹瀉',
  '痔瘡',
  '血便'
]
const urinaryOptions = ['正常', '排尿困難', '疼痛', '灼熱感', '頻尿', '失禁', '滲尿', '血尿', '茶色尿', '餘尿多', '尿床']
const reproductiveFemaleOptions = ['正常', '乳房腫塊', '停經']
const reproductiveMaleOptions = ['正常']
const skeletalOptions = ['正常', '脊椎側彎', '駝背']

const languageOptions = ['國語', '台語', '客家語', '筆談', '圖片', '手勢', '其他']
const marriageOptions = ['未婚', '已婚', '離婚', '喪偶', '分居', '其他']

const createContactEntry = (initial = {}) => ({
  man: initial.man ?? '',
  relationship: initial.relationship ?? '',
  phone: initial.phone ?? '',
  address: initial.address ?? ''
})

const createObstacleInput = (initial = {}) => ({
  kind: initial.kind ?? '',
  lv: initial.lv ?? '',
  date: initial.date ?? ''
})


const nursingAssessmentDefaults = () => ({
  identity: [],
  identityOther: '',
  education: [],
  occupation: [],
  dietTypes: [],
  dietTypesOther: '',
  dietTextures: [],
  dietTexturesOther: '',
  dietRoutes: [],
  dietPreference: [],
  dietPreferenceOther: '',
  dietTaboo: [],
  dietTabooOther: '',
  sleepSpirit: [],
  sleepPattern: [],
  sleepHours: '',
  sleepMedication: '',
  sleepOther: '',
  bowelCondition: [],
  bowelFrequency: [],
  bowelDays: '',
  bowelTimes: '',
  bowelMethod: [],
  bowelAid: [],
  urineCondition: [],
  urineAppearance: [],
  urineMethod: [],
  activityAbility: [],
  gait: [],
  gaitOther: '',
  adlGrooming: '',
  adlEating: '',
  adlDressing: '',
  adlBathing: '',
  adlToileting: '',
  adlTransfer: '',
  fallFrequency: [],
  fallLastYear: [],
  fallLocation: [],
  fallLocationOther: '',
  fallInjury: [],
  fallInjuryPart: '',
  fallInjuryDetail: '',
  smoking: [],
  smokingDailyAmount: '',
  smokingYears: '',
  smokingQuitYears: '',
  drinking: [],
  drinkingDailyAmount: '',
  drinkingType: '',
  leisureActivities: [],
  leisureOther: '',
  appearance: [],
  emotion: [],
  emotionOther: '',
  nerve: [],
  nervePain: '',
  nerveNumb: '',
  nerveNoSensation: '',
  nerveConvulsion: '',
  skin: [],
  skinOther: '',
  senses: [],
  sensesOther: '',
  respiratory: [],
  respiratoryOther: '',
  sputum: [],
  sputumColor: '',
  sputumAmount: '',
  sputumNature: '',
  cardiovascular: [],
  cardiovascularOther: '',
  gastrointestinal: [],
  gastrointestinalOther: '',
  urinary: [],
  urinaryOther: '',
  reproductiveFemale: [],
  reproductiveFemaleOther: '',
  reproductiveMale: [],
  reproductiveMaleOther: '',
  skeletal: [],
  skeletalOther: '',
  skeletalFracture: '',
  skeletalAmputation: ''
})

const DisabilityCertItems = ['無', '輕度', '中度', '重度', '極重度']
const DisabilityCertOtherItems = [
  '第一類：神經系統構造及精神、心智功能',
  '第二類：眼、耳及相關構造與感官功能及疼痛平衡功能',
  '第三類：涉及聲音與言語構造及其功能',
  '第四類：循環、造血、免疫與呼吸系統構造及其功能',
  '第五類：消化、新陳代謝與內分泌系統相關構造及其功能',
  '第六類：泌尿與生殖系統相關構造及其功能',
  '第七類：神經、肌肉、骨骼之移動相關構造及其功能',
  '第八類：皮膚與相關構造及其功能',
  '第九類：發展遲緩',
  '第十類：其它類'
]

const createDefaultList = () => ({
  createInfo: {},
  editInfo: [],
  picInfo: {
    picName: '',
    picOriginalName: ''
  },
  hidden: '',
  p_code: '',
  name: '',
  faith: '',
  height: '',
  weight: '',
  usual_hospital: '',
  keepthings: '',
  
  languages: [],
  language1: '',
  language2: '',
  language3: '',
  language4: '',
  language5: '',
  language6: '',
  language7: '',
  language8: '',
  marriageStatuses: [],
  marry1: '',
  marry2: '',
  marry3: '',
  marry4: '',
  marry5: '',
  marry6: '',
  marry7: '',
  obstacleArr: [],
  obstacleInput: {
    kind: '',
    lv: '',
    date: ''
  },
  nursingAssessment: nursingAssessmentDefaults(),
  contactMan: [
    {
      man: '',
      relationship: '',
      phone: '',
      address: ''
    }
  ],
  HasLastHospital: '無',
  LastHospital: {
    AdmittedDate: '',
    DischargedDate: '',
    ICD10: '',
    OrgName: ''
  },
  Welfare: {
    MajorIllnessCert: { Value: '無', Other: '' },
    DisabilityCert: { Value: '無', Other: [] }
  },
  visitLimit: false,
  visitLimitContent: ''
})

const list = reactive(createDefaultList())
const oldList = ref()
const hasExistingPhoto = computed(() => Boolean(list.picInfo?.picName))

const normalizePicInfo = (source = {}) => {
  const info = source.picInfo ?? {}
  const picName = info.picName || source.pic_url || ''
  return {
    picName,
    picOriginalName: info.picOriginalName ?? ''
  }
}

const clearUploadPreview = () => {
  uploadImage.file = null
  uploadImage.preview = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const age = () => {
  if (!list.birthday || list.birthday === '0000-00-00') return ''
  return parseInt(dayjs().format('YYYY'), 10) - parseInt(dayjs(list.birthday).format('YYYY'), 10)
}

// 生成病歷號
const createPcode = async () => {
  const total = await api.get('user').then((rs) => (Array.isArray(rs) ? rs.length : 0))
  const next = total + 1
  list.p_code = next.toString().padStart(4, '0')
}

const addProcess = async () => {
  processType.value = 'add'
  title.value = '新增病歷'
  titleColor.value = 'primary'
  idEdit.value = true
  disabled.value = true
  clearUploadPreview()
  list.picInfo = { picName: '', picOriginalName: '' }
  list.pic_url = defaultPicName
  list.in_date = dayjs().format('YYYY-MM-DD')

  dialog.value = true
  await nextTick()
  form.value?.resetValidation()
  createPcode()
}

const editProcess = (item) => {
  console.log('editProcess item', item)
  processType.value = 'edit'
  title.value = '修改病歷資料'
  titleColor.value = 'secondary'
  idEdit.value = true
  disabled.value = true
  clearUploadPreview()
  Object.assign(list, item)
  list.picInfo = normalizePicInfo(item)
  list.pic_url = list.picInfo.picName || defaultPicName
  oldList.value = item

  dialog.value = true
}

const addObstacle = (type = null) => {
  const input = list.obstacleInput
  if (type === 'forever') {
    if (input.kind && input.lv) {
      list.obstacleArr.push({ kind: input.kind, lv: input.lv, date: '無限期' })
      list.obstacleInput = createObstacleInput({ kind: input.kind, lv: input.lv })
    } else {
      store.showToastMulti({
        type: 'warning',
        message: '請先選擇障礙類別與障礙等級',
        closeTime: 2,
      })
    }
    return
  }

  if (input.kind && input.lv && input.date && input.date !== '0000-00-00') {
    list.obstacleArr.push({
      kind: input.kind,
      lv: input.lv,
      date: input.date
    })
    list.obstacleInput = createObstacleInput({ kind: input.kind, lv: input.lv })
  } else {
    store.showToastMulti({
      type: 'warning',
      message: '請完整填寫障礙類別、等級與到期日',
      closeTime: 2,
    })
  }
}

const delObstacle = (index) => {
  list.obstacleArr.splice(index, 1)
}

const validateForm = async () => {
  const result = await form.value?.validate()
  return result?.valid ?? false
}

const addOK = async () => {
  if (loading.value) return

  const valid = await validateForm()
  if (!valid) {
    store.showToastMulti({
      type: 'warning',
      message: '資料輸入不完整,請再確認',
      closeTime: 2,
    })
    return
  }

  const duplicate = await api.get('user').then((rs) => rs.find((item) => item.p_code === list.p_code || item.id_num === list.id_num))
  if (duplicate) {
    store.showToastMulti({
      type: 'warning',
      message: duplicate.p_code === list.p_code ? '病歷號重覆!!請再確認!!' : '身分證字號重覆!!請再確認!!',
      closeTime: 2,
    })
    return
  }


  // 如果 uploadImage 有資料，代表有重上傳新圖片，則刪除舊圖片並更新圖片
  if (uploadImage.file && uploadImage.file.size > 0) {
    await uploadPicProcess()
  }

  list.createInfo = {
    snkey: store.state.pData.snkey,
    name: store.state.pData.username,
    time: dayjs().format('YYYY-MM-DD HH:mm:ss')
  }
  const postData = {
    datalist: JSON.stringify(list)
  }

  loading.value = true
  try {
    const rs = await api.add('user', postData)
    if (rs?.state == 1) {
      store.showToastMulti({
        type: 'success',
        message: '已新增',
        closeTime: 2,
      })
      dialog.value = false
      emit('getAllData')
    } else {
      store.showToastMulti({
        type: 'error',
        message: rs?.message ?? '新增失敗',
        closeTime: 2,
      })
    }
  } finally {
    loading.value = false
  }
}

const editOK = async () => {
  const valid = await validateForm()
  if (!valid) return

  const duplicate = await api.get('user').then((rs) => rs.find((item) => item.p_code === list.p_code))
  if (duplicate && oldList.value.p_code !== list.p_code) {
    store.showToastMulti({
      type: 'warning',
      message: '病歷號重覆!!請再確認!!',
      closeTime: 2,
    })
    return
  }

  // 如果 uploadImage 有資料，代表有重上傳新圖片，則刪除舊圖片並更新圖片
  if (uploadImage.file && uploadImage.file.size > 0) {
    await uploadPicProcess()
  }

  list.editInfo.unshift({
    snkey: store.state.pData.snkey,
    name: store.state.pData.username,
    time: dayjs().format('YYYY-MM-DD HH:mm:ss')
  })
  const postData = {
    snkey: list.snkey,
    datalist: JSON.stringify(list),
    updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
  }

  const rs = await api.post('user', postData)
  console.log('edit process rs', rs)
  if (rs?.state == 1) {
    store.showToastMulti({
      type: 'success',
      message: '已修改',
      closeTime: 2,
    })

    emit('getAllData')
    dialog.value = false
    store.state.uData = list
    // sessionStorage.setItem('uData', JSON.stringify(list))

  }
}

const uploadPicProcess = async () => {
  console.log('uploadPicProcess')
  //如果原始資料存在舊圖片，則刪除舊圖片
  if (list.picInfo && list.picInfo.picName && list.picInfo.picName !== defaultPicName) {
    let rs = await delExistPic(list.picInfo.picName)
    // console.log('delExistPic rs', rs)
    if (rs?.state !== 1) {
      store.showToastMulti({
        type: 'error',
        message: rs?.message ?? '舊圖片刪除失敗',
        closeTime: 2,
      })
      return
    }
  }

  uploading.value = true
  let rs
  try {
    rs = await onUpload(databaseName)
    console.log('upload rs', rs)
  } finally {
    uploading.value = false
  }

  if (rs?.state === 1) {
    list.picInfo = {
      picName: rs.newName,
      picOriginalName: uploadImage.file.name
    }
    list.pic_url = list.picInfo.picName || defaultPicName
    clearUploadPreview()
  } else {
    store.showToastMulti({
      type: 'error',
      message: rs?.message ?? '圖片上傳失敗',
      closeTime: 2,
    })
    return
  }
}

//上傳圖片或檔案都適用
const onUpload = (tablename) => {
  const fd = new FormData()
  fd.append("file", uploadImage.file)
  return api.upload(tablename, fd)
}

const delExistPic = async (picName) => {
  const url = `general/delPic/${databaseName}/${picName}`
  const rs = await api.options(url)
  console.log('delExistPic rs', rs)
  return rs
}

const onFileSelected = (event) => {
  const file = event.target.files?.[0] ?? null
  if (!file) {
    clearUploadPreview()
    return
  }

  const extension = file.name.split('.').pop().toLowerCase()
  const fitType = ['gif', 'png', 'jpg', 'jpeg']
  let errorMsg = ''
  if (!fitType.includes(extension)) {
    errorMsg = `檔案:${file.name}不是支持的影像檔案`
  }
  if (file.size > 1024 * 1024 * 5) {
    errorMsg = `檔案:${file.name}不能超過5M唷`
  }

  if (errorMsg) {
    store.commit('snackbar', { msg: errorMsg, type: true, theme: 'warning' })
    clearUploadPreview()
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    uploadImage.preview = e.target?.result?.toString() ?? ''
  }
  reader.readAsDataURL(file)
  uploadImage.file = file
}


// 新增連絡人
const newContact = () => {
  list.contactMan.push(createContactEntry())
}

// 刪除連絡人
const delContact = (index) => {
  if (!Array.isArray(list.contactMan) || list.contactMan.length === 0) {
    list.contactMan = [createContactEntry()]
    return
  }
  if (list.contactMan.length <= 1) {
    Object.assign(list.contactMan[0], createContactEntry())
    return
  }
  list.contactMan.splice(index, 1)
}

// 上傳照片 預覽階段
const goUploadThumb = () => {
  fileInput.value?.click()
}

const removeExistingPhoto = async () => {
  if (!hasExistingPhoto.value || !list.picInfo?.picName) return
  const picName = list.picInfo.picName
  const rs = await delExistPic(picName)
  if (rs?.state == 1) {
    list.picInfo.picName = ''
    list.picInfo.picOriginalName = ''
    list.pic_url = defaultPicName
    clearUploadPreview()
    store.showToastMulti({
      type: 'success',
      message: '已刪除照片',
      closeTime: 2,
    })
  } else {
    store.showToastMulti({
      type: 'error',
      message: rs?.message ?? '刪除照片失敗',
      closeTime: 2,
    })
  }
}

// 跳轉到指定區段
const scrollToSection = (id) => {
  nextTick(() => {
    const target = document.getElementById(id)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

// 區段錨點
const sectionAnchors = computed(() =>
  [
    { id: 'section-personal', label: '個人基本資料' },
    { id: 'section-welfare', label: '身分福利別', condition: !!list.Welfare },
    { id: 'section-obstacle', label: '障礙設定' },
    { id: 'section-language', label: '語言與婚姻資訊' },
    { id: 'section-contacts', label: '連絡人資料' },
    { id: 'section-nursing', label: '入院護理評估' },
    { id: 'section-visit', label: '訪視設定' }
  ].filter((item) => item.condition ?? true)
)



const baseUrl = computed(() => store.state.base_url)

defineExpose({ addProcess, editProcess })

const stripWrapperCharacters = (value) =>
  value
    .replace(/^[\[{\s]*/, '')
    .replace(/[\]}\s]*$/, '')


</script>

<style scoped lang="scss">
.add-record-btn {
  padding-inline: 24px;
  letter-spacing: 0.05em;
  font-weight: 600;
  background: linear-gradient(135deg,
      rgba(74, 107, 95, 0.95),
      rgba(123, 163, 184, 0.92));
  color: #ffffff;
  text-transform: none;

  &:hover {
    box-shadow: 0 10px 24px rgba(90, 122, 111, 0.34);
  }
}
</style>
