const REGEX = {
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  DOB: /^\d{2}\/\d{2}\/\d{4}$/,
};

const USER_ROLE = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
  DOCTOR: 'DOCTOR',
  WAREHOUSE_MANAGER: 'WAREHOUSE_MANAGER',
};

const USER_GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
};

const VERIFICATION_CODE_SEND_TYPE = {
  EMAIL: 'EMAIL',
  SMS: 'SMS',
};

const VERIFICATION_CODE_TARGET_TYPE = {
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  VERIFY_EMAIL: 'VERIFY_EMAIL',
};

const VERIFICATION_CODE_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
};

const VACCINATION_STATUS = {
  SCREEN_TEST_WAITING: 'SCREEN_TEST_WAITING',
  SCREEN_TESTING: 'SCREEN_TESTING',
  SCREEN_TEST_PASSED: 'SCREEN_TEST_PASSED',
  SCREEN_TEST_REJECTED: 'SCREEN_TEST_REJECTED',
  INJECT_WAITING: 'INJECT_WAITING',
  INJECTING: 'INJECTING',
  INJECTED: 'INJECTED',
  WAITED_AFTER_INJECTION: 'WAITED_AFTER_INJECTION',
};

const HEALTH_SURVEY_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
};

const NOTIFICATION_TEMPLATE = {
  VERIFY_EMAIL: {
    title: 'Xác thực email',
    content:
      'Chúc mừng bạn đã đăng ký tài khoản thành công tại hệ thống tiêm chủng vaccine. Đây là mã xác minh để xác thực email @{{code}}. Mã có hiệc lực trong vòng @{{expirationTime}} giây. Vui lòng không cung cấp mã này với bất ki ai.',
  },
  CHANGE_PASSWORD: {
    title: 'Thay đổi mật khẩu',
    content:
      'Mã xác mình để thay đổi mật khẩu là @{{code}}. Mã có hiệc lực trong vòng @{{expirationTime}} giây. Vui lòng không cung cấp mã này với bất ki ai.',
  },
};

const SCOPES = {
  // user
  1: '[GET][/admin/users]',
  2: '[GET][/admin/users/:userId]',
  3: '[POST][/admin/users]',
  4: '[PUT][/admin/users/:userId]',
  5: '[DELETE][/admin/users/:userId]',

  // vaccine provider
  6: '[POST][/admin/vaccineProviders]',
  7: '[PUT][/admin/vaccineProviders/:vaccineProviderId]',
  8: '[DELETE][/admin/vaccineProviders/:vaccineProviderId]',

  // vaccine
  9: '[POST][/admin/vaccines]',
  10: '[PUT][/admin/vaccines/:vaccineId]',
  11: '[DELETE][/admin/vaccines/:vaccineId]',

  // vaccination schedule
  12: '[GET][/admin/vaccinationSchedules]',
  13: '[GET][/admin/vaccinationSchedules/:vaccinationScheduleId]',
  14: '[POST][/admin/vaccinationSchedules]',
  15: '[PUT][/admin/vaccinationSchedules/:vaccinationScheduleId/healthSurveyStatus]',
  16: '[PUT][/admin/vaccinationSchedules/:vaccinationScheduleId]',
  17: '[DELETE][/admin/vaccinationSchedules/:vaccinationScheduleId]',

  // vaccination history
  18: '[GET][/admin/vaccinationHistories]',
  19: '[GET][/admin/vaccinationHistories/:vaccinationHistoryId]',
  20: '[POST][/admin/vaccinationHistories]',
  21: '[PUT][/admin/vaccinationHistories/:vaccinationHistoryId/status]',
  22: '[DELETE][/admin/vaccinationHistories/:vaccinationHistoryId]',
  23: '[POST][/admin/vaccinationHistories/:vaccinationHistoryId/payment]',
  24: '[GET][/admin/statistic]',
};

// should manage by database
const USER_ROLE_SCOPE = {
  [USER_ROLE.ADMIN]: [1, 2, 3, 4, 5, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  [USER_ROLE.DOCTOR]: [1, 2, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
  [USER_ROLE.WAREHOUSE_MANAGER]: [6, 7, 8, 9, 10, 11, 18, 23],
};

const USER_LOCK_REASON = {
  WRONG_PASSWORD: 'WRONG_PASSWORD',
};

const PAYMENT_METHOD = {
  CASH: 'CASH',
};

const STATISTIC_TYPE = {
  DAY: 'DAY',
  MONTH: 'MONTH',
  YEAR: 'YEAR',
};

module.exports = {
  A_WEEK: 7 * 86400 * 1000,
  REGEX,

  SCOPES,

  USER_ROLE,
  USER_GENDER,
  USER_ROLE_SCOPE,
  USER_LOCK_REASON,

  VACCINATION_STATUS,
  NOTIFICATION_TEMPLATE,

  VERIFICATION_CODE_SEND_TYPE,
  VERIFICATION_CODE_TARGET_TYPE,
  VERIFICATION_CODE_STATUS,

  HEALTH_SURVEY_STATUS,
  PAYMENT_METHOD,
  STATISTIC_TYPE,
};
