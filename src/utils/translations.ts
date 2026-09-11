export type Language = 'en' | 'zh' | 'es' | 'fr' | 'eo' | 'ru';

export interface Translations {
  // App header
  appName: string;

  // Navigation
  timerTab: string;
  statsTab: string;

  // Timer component - controls
  start: string;
  pause: string;
  reset: string;
  finish: string;

  // Timer component - notifications
  workCompleted: string;
  breakCompleted: string;

  // Mode indicator
  workSession: string;
  breakTime: string;

  // Browser notifications
  notificationWorkBody: string;
  notificationBreakBody: string;

  // Timer component - confirmation modal
  confirmFinish: string;
  confirmFinishMessage: string;

  // Tag selector
  selectCategory: string;
  addTag: string;
  tagPlaceholder: string;
  add: string;
  cancel: string;
  deleteTagTitle: string;
  deleteTagMessage: string;
  tagNameEmpty: string;
  tagNameDuplicate: string;

  // Stats page
  statsTitle: string;
  overall: string;
  byCategory: string;
  totalSessions: string;
  totalTime: string;
  sessions: string;
  ofTotalSessions: string;
  noSessionsYet: string;

  // Settings panel
  settings: string;
  settingsTitle: string;
  darkMode: string;
  language: string;
  workDuration: string;
  breakDuration: string;
  minutes: string;
  soundEffects: string;
  clearData: string;
  clearDataConfirm: string;
  save: string;
  close: string;

  // Session notes
  sessionNotePlaceholder: string;

  // Session history
  sessionHistory: string;
  allSessions: string;

  // Error boundary
  errorBoundaryTitle: string;
  errorBoundaryMessage: string;
  errorBoundaryReset: string;

  // --- Daily summary (added) ---
  dailySummary: string;
  todayStudy: string;
  todayPomodoros: string;
  activeDays: string;
  dailyHistory: string;
  noRecordToday: string;
  times: string;
  hourShort: string;
  minuteShort: string;
  todayStudyDay: string;
  yesterdayLabel: string;
  /** Uses {m} and {d} placeholders. */
  monthDayLabel: string;
  streakDays: string;

  // --- Landscape focus mode (added) ---
  /** Label of the button that leaves the immersive landscape screen. */
  exitFocus: string;
  /** Label of the button that re-enters it from the normal landscape UI. */
  enterFocus: string;

  // --- End-of-session alert (added) ---
  workDoneTitle: string;
  breakDoneTitle: string;
  workDoneBody: string;
  breakDoneBody: string;
  startBreak: string;
  continueStudy: string;

  // --- Misc (added) ---
  rotateHint: string;
  keepingAwake: string;
}

const translations: Record<Language, Translations> = {
  en: {
	appName: 'PomoDoroto',
	timerTab: 'Timer',
	statsTab: 'Stats',
	start: 'Start',
	pause: 'Pause',
	reset: 'Reset',
	finish: 'FINISH',
	workCompleted: 'Work session completed!',
	breakCompleted: 'Break completed!',
	workSession: 'Work Session',
	breakTime: 'Break Time',
	notificationWorkBody: 'Time for a break!',
	notificationBreakBody: 'Ready to work!',
	confirmFinish: 'Finish Session?',
	confirmFinishMessage: 'Are you sure you want to end this Pomodoro session early?',
	selectCategory: 'Select Label',
	addTag: 'Add Tag',
	tagPlaceholder: 'Add a tag (work, study, exercise...)',
	add: 'Add',
	cancel: 'Cancel',
	deleteTagTitle: 'Delete Tag?',
	deleteTagMessage: 'Are you sure you want to delete',
	tagNameEmpty:'Tag name cannot be empty',
	tagNameDuplicate:'A tag with that name already exists',
	statsTitle: 'Your Pomodoro Stats',
	overall: 'Overall',
	byCategory: 'By Label',
	totalSessions: 'Total Sessions:',
	totalTime: 'Total Time:',
	sessions: 'sessions',
	ofTotalSessions: 'of total sessions',
	noSessionsYet: 'No completed sessions yet. Start a timer to see stats!',
	settings: 'Settings',
	settingsTitle: 'Settings',
	darkMode: 'Dark Mode',
	language: 'Language',
	workDuration: 'Work Duration',
	breakDuration: 'Break Duration',
	minutes: 'minutes',
	soundEffects: 'Sound Effects',
	clearData: 'Reset Timer',
	clearDataConfirm: 'Are you sure? This will reset timer and settings.',
	save: 'Save',
	close: 'Close',
	sessionNotePlaceholder: 'Add a note about this pomodoro...',
	sessionHistory: 'Session History',
	allSessions: 'All',
	errorBoundaryTitle: 'Something went wrong',
	errorBoundaryMessage: 'This section encountered an error. You can try again or reload the page.',
	errorBoundaryReset: 'Try Again',

	dailySummary: 'Daily Summary',
	todayStudy: 'Studied today',
	todayPomodoros: 'Pomodoros today',
	activeDays: 'Active days',
	dailyHistory: 'Daily history',
	noRecordToday: 'No study recorded today yet. Hit start!',
	times: 'sessions',
	hourShort: 'h',
	minuteShort: 'min',

	workDoneTitle: 'Focus finished!',
	breakDoneTitle: 'Break finished!',
	workDoneBody: 'Nice work — take a break.',
	breakDoneBody: 'Break is over. Back to studying!',
	startBreak: 'Start break',
	continueStudy: 'Continue studying',

	rotateHint: 'Rotate your phone for the best view',
	keepingAwake: 'Screen will stay awake',
	todayStudyDay: 'Today',
	yesterdayLabel: 'Yesterday',
	monthDayLabel: '{m}/{d}',
	streakDays: 'Day streak',
	exitFocus: 'Exit focus',
	enterFocus: 'Focus mode',
  },

  zh: {
	appName: '番茄钟',
	timerTab: '计时',
	statsTab: '总结',
	start: '开始',
	pause: '暂停',
	reset: '重置',
	finish: '结束',
	workCompleted: '专注结束！',
	breakCompleted: '休息结束！',
	workSession: '专注学习',
	breakTime: '休息时间',
	notificationWorkBody: '该休息一下了！',
	notificationBreakBody: '休息结束，继续学习！',
	confirmFinish: '提前结束本轮？',
	confirmFinishMessage: '确定要提前结束这一轮番茄钟吗？已用时间会被记录下来。',
	selectCategory: '选择标签',
	addTag: '添加标签',
	tagPlaceholder: '添加标签（学习、数学、英语……）',
	add: '添加',
	cancel: '取消',
	deleteTagTitle: '删除标签？',
	deleteTagMessage: '确定要删除标签',
	tagNameEmpty: '标签名不能为空',
	tagNameDuplicate: '已存在同名标签',
	statsTitle: '番茄统计',
	overall: '总计',
	byCategory: '按标签',
	totalSessions: '总次数：',
	totalTime: '总时长：',
	sessions: '次',
	ofTotalSessions: '占全部次数',
	noSessionsYet: '还没有完成的记录，开始一次计时就能看到统计啦！',
	settings: '设置',
	settingsTitle: '设置',
	darkMode: '深色模式',
	language: '语言',
	workDuration: '学习时长',
	breakDuration: '休息时长',
	minutes: '分钟',
	soundEffects: '提示音',
	clearData: '重置计时器',
	clearDataConfirm: '确定吗？这会清空计时器和设置。',
	save: '保存',
	close: '关闭',
	sessionNotePlaceholder: '给这次番茄加个备注……',
	sessionHistory: '历史记录',
	allSessions: '全部',
	errorBoundaryTitle: '出了点问题',
	errorBoundaryMessage: '这个区域出错了，可以重试或刷新页面。',
	errorBoundaryReset: '重试',

	dailySummary: '每日总结',
	todayStudy: '今日学习',
	todayPomodoros: '今日番茄',
	activeDays: '学习天数',
	dailyHistory: '每日记录',
	noRecordToday: '今天还没有学习记录，点开始学习吧！',
	times: '次',
	hourShort: '小时',
	minuteShort: '分钟',

	workDoneTitle: '专注结束！',
	breakDoneTitle: '休息结束！',
	workDoneBody: '干得漂亮，休息一下吧。',
	breakDoneBody: '休息够了，继续学习！',
	startBreak: '开始休息',
	continueStudy: '继续学习',

	rotateHint: '横屏查看效果更好',
	keepingAwake: '屏幕将保持常亮',
	todayStudyDay: '今天',
	yesterdayLabel: '昨天',
	monthDayLabel: '{m}月{d}日',
	streakDays: '连续天数',
	exitFocus: '退出横屏',
	enterFocus: '专注模式',
  },

  es: {
	appName: 'PomoDoroto',
	timerTab: 'Temporizador',
	statsTab: 'Estadísticas',
	start: 'Iniciar',
	pause: 'Pausar',
	reset: 'Reiniciar',
	finish: 'FINALIZAR',
	workCompleted: '¡Sesión de trabajo completada!',
	breakCompleted: '¡Descanso completado!',
	workSession: 'Sesión de Trabajo',
	breakTime: 'Descanso',
	notificationWorkBody: '¡Hora de descansar!',
	notificationBreakBody: '¡Listo para trabajar!',
	confirmFinish: '¿Finalizar Sesión?',
	confirmFinishMessage: '¿Estás seguro de que quieres terminar esta sesión Pomodoro antes de tiempo?',
	selectCategory: 'Seleccionar Etiqueta',
	addTag: 'Agregar Etiqueta',
	tagPlaceholder: 'Agrega una etiqueta (trabajo, estudio, ejercicio...)',
	add: 'Agregar',
	cancel: 'Cancelar',
	deleteTagTitle: '¿Eliminar Etiqueta?',
	deleteTagMessage: '¿Estás seguro de que quieres eliminar',
	tagNameEmpty: 'El nombre de la etiqueta no puede estar vacío',
	tagNameDuplicate: 'Ya existe una etiqueta con ese nombre',
	statsTitle: 'Tus Estadísticas Pomodoro',
	overall: 'General',
	byCategory: 'Por Etiqueta',
	totalSessions: 'Total de Sesiones:',
	totalTime: 'Tiempo Total:',
	sessions: 'sesiones',
	ofTotalSessions: 'del total de sesiones',
	noSessionsYet: '¡Aún no hay sesiones completadas. Inicia un temporizador para ver estadísticas!',
	settings: 'Ajustes',
	settingsTitle: 'Ajustes',
	darkMode: 'Modo Oscuro',
	language: 'Idioma',
	workDuration: 'Duración de Trabajo',
	breakDuration: 'Duración de Descanso',
	minutes: 'minutos',
	soundEffects: 'Efectos de Sonido',
	clearData: 'Reiniciar Temporizador',
	clearDataConfirm: 'Esto reiniciará el temporizador y los ajustes.',
	save: 'Guardar',
	close: 'Cerrar',
	sessionNotePlaceholder: 'Agrega una nota sobre este pomodoro...',
	sessionHistory: 'Historial de Sesiones',
	allSessions: 'Todas',
	errorBoundaryTitle: 'Algo salió mal',
	errorBoundaryMessage: 'Esta sección encontró un error. Puedes intentar de nuevo o recargar la página.',
	errorBoundaryReset: 'Intentar de nuevo',

	dailySummary: 'Resumen Diario',
	todayStudy: 'Estudiado hoy',
	todayPomodoros: 'Pomodoros hoy',
	activeDays: 'Días activos',
	dailyHistory: 'Historial diario',
	noRecordToday: 'Aún no hay estudio registrado hoy. ¡Empieza!',
	times: 'sesiones',
	hourShort: 'h',
	minuteShort: 'min',

	workDoneTitle: '¡Enfoque terminado!',
	breakDoneTitle: '¡Descanso terminado!',
	workDoneBody: 'Buen trabajo, toma un descanso.',
	breakDoneBody: 'Se acabó el descanso. ¡A estudiar!',
	startBreak: 'Empezar descanso',
	continueStudy: 'Seguir estudiando',

	rotateHint: 'Gira el teléfono para verlo mejor',
	keepingAwake: 'La pantalla permanecerá encendida',
	todayStudyDay: 'Hoy',
	yesterdayLabel: 'Ayer',
	monthDayLabel: '{d}/{m}',
	streakDays: 'Días seguidos',
	exitFocus: 'Salir',
	enterFocus: 'Modo enfoque',
  },

  fr: {
	appName: 'PomoDoroto',
	timerTab: 'Minuteur',
	statsTab: 'Statistiques',
	start: 'Démarrer',
	pause: 'Pause',
	reset: 'Réinitialiser',
	finish: 'TERMINER',
	workCompleted: 'Session de travail terminée !',
	breakCompleted: 'Pause terminée !',
	workSession: 'Session de Travail',
	breakTime: 'Pause',
	notificationWorkBody: 'C\'est l\'heure de la pause !',
	notificationBreakBody: 'Prêt à travailler !',
	confirmFinish: 'Terminer la Session ?',
	confirmFinishMessage: 'Êtes-vous sûr de vouloir terminer cette session Pomodoro plus tôt ?',
	selectCategory: 'Sélectionner une Étiquette',
	addTag: 'Ajouter une Étiquette',
	tagPlaceholder: 'Ajouter une étiquette (travail, étude, exercice...)',
	add: 'Ajouter',
	cancel: 'Annuler',
	deleteTagTitle: 'Supprimer l\'Étiquette ?',
	deleteTagMessage: 'Êtes-vous sûr de vouloir supprimer',
	tagNameEmpty: 'Le nom de l\'étiquette ne peut pas être vide',
	tagNameDuplicate: 'Une étiquette avec ce nom existe déjà',
	statsTitle: 'Vos Statistiques Pomodoro',
	overall: 'Général',
	byCategory: 'Par Étiquette',
	totalSessions: 'Sessions Totales :',
	totalTime: 'Temps Total :',
	sessions: 'sessions',
	ofTotalSessions: 'du total des sessions',
	noSessionsYet: 'Aucune session terminée pour le moment. Démarrez un minuteur pour voir les statistiques !',
	settings: 'Paramètres',
	settingsTitle: 'Paramètres',
	darkMode: 'Mode Sombre',
	language: 'Langue',
	workDuration: 'Durée de Travail',
	breakDuration: 'Durée de Pause',
	minutes: 'minutes',
	soundEffects: 'Effets Sonores',
	clearData: 'Réinitialiser Minuteur',
	clearDataConfirm: 'Cela réinitialisera le minuteur et les paramètres.',
	save: 'Enregistrer',
	close: 'Fermer',
	sessionNotePlaceholder: 'Ajoutez une note sur ce pomodoro...',
	sessionHistory: 'Historique des Sessions',
	allSessions: 'Toutes',
	errorBoundaryTitle: 'Quelque chose a mal tourné',
	errorBoundaryMessage: 'Cette section a rencontré une erreur. Vous pouvez réessayer ou recharger la page.',
	errorBoundaryReset: 'Réessayer',

	dailySummary: 'Résumé Quotidien',
	todayStudy: 'Étudié aujourd\'hui',
	todayPomodoros: 'Pomodoros aujourd\'hui',
	activeDays: 'Jours actifs',
	dailyHistory: 'Historique quotidien',
	noRecordToday: 'Aucune étude enregistrée aujourd\'hui. Commencez !',
	times: 'sessions',
	hourShort: 'h',
	minuteShort: 'min',

	workDoneTitle: 'Concentration terminée !',
	breakDoneTitle: 'Pause terminée !',
	workDoneBody: 'Beau travail, prenez une pause.',
	breakDoneBody: 'La pause est finie. Au travail !',
	startBreak: 'Commencer la pause',
	continueStudy: 'Continuer à étudier',

	rotateHint: 'Tournez le téléphone pour un meilleur affichage',
	keepingAwake: 'L\'écran restera allumé',
	todayStudyDay: 'Aujourd\'hui',
	yesterdayLabel: 'Hier',
	monthDayLabel: '{d}/{m}',
	streakDays: 'Jours de suite',
	exitFocus: 'Quitter',
	enterFocus: 'Mode focus',
  },

  eo: {
	appName: 'PomoDoroto',
	timerTab: 'Horloĝo',
	statsTab: 'Statistikoj',
	start: 'Komenci',
	pause: 'Paŭzi',
	reset: 'Rekomenci',
	finish: 'FINI',
	workCompleted: 'Laborseanco finita!',
	breakCompleted: 'Paŭzo finita!',
	workSession: 'Laborseanco',
	breakTime: 'Paŭzo',
	notificationWorkBody: 'Tempo por paŭzo!',
	notificationBreakBody: 'Preta por labori!',
	confirmFinish: 'Ĉu Fini la Seancon?',
	confirmFinishMessage: 'Ĉu vi certas, ke vi volas fini ĉi tiun Pomodoro-seancon frutempe?',
	selectCategory: 'Elektu Etikedon',
	addTag: 'Aldoni Etikedon',
	tagPlaceholder: 'Aldonu etikedon (laboro, studo, ekzerco...)',
	add: 'Aldoni',
	cancel: 'Nuligi',
	deleteTagTitle: 'Ĉu Forigi Etikedon?',
	deleteTagMessage: 'Ĉu vi certas, ke vi volas forigi',
	tagNameEmpty: 'Etikedonomo ne povas esti malplena',
	tagNameDuplicate: 'Etikedo kun tiu nomo jam ekzistas',
	statsTitle: 'Viaj Pomodoro Statistikoj',
	overall: 'Ĝenerala',
	byCategory: 'Laŭ Etikedo',
	totalSessions: 'Tutaj Seancoj:',
	totalTime: 'Tuta Tempo:',
	sessions: 'seancoj',
	ofTotalSessions: 'de tutaj seancoj',
	noSessionsYet: 'Ankoraŭ neniuj finitaj seancoj. Komencu horloĝon por vidi statistikojn!',
	settings: 'Agordoj',
	settingsTitle: 'Agordoj',
	darkMode: 'Malhela Reĝimo',
	language: 'Lingvo',
	workDuration: 'Labordaŭro',
	breakDuration: 'Paŭzodaŭro',
	minutes: 'minutoj',
	soundEffects: 'Sonefektoj',
	clearData: 'Restarigi Horloĝon',
	clearDataConfirm: 'Tio restarigos la horloĝon kaj agordojn.',
	save: 'Konservi',
	close: 'Fermi',
	sessionNotePlaceholder: 'Aldonu noton pri ĉi tiu pomodoro...',
	sessionHistory: 'Seanca Historio',
	allSessions: 'Ĉiuj',
	errorBoundaryTitle: 'Io misfunkciis',
	errorBoundaryMessage: 'Ĉi tiu sekcio renkontis eraron. Vi povas reprovi aŭ reŝargi la paĝon.',
	errorBoundaryReset: 'Reprovi',

	dailySummary: 'Ĉiutaga Resumo',
	todayStudy: 'Studite hodiaŭ',
	todayPomodoros: 'Pomodoro hodiaŭ',
	activeDays: 'Aktivaj tagoj',
	dailyHistory: 'Ĉiutaga historio',
	noRecordToday: 'Ankoraŭ neniu studo hodiaŭ. Komencu!',
	times: 'seancoj',
	hourShort: 'h',
	minuteShort: 'min',

	workDoneTitle: 'Fokuso finita!',
	breakDoneTitle: 'Paŭzo finita!',
	workDoneBody: 'Bone farite, ripozu iomete.',
	breakDoneBody: 'La paŭzo finiĝis. Reen al studado!',
	startBreak: 'Komenci paŭzon',
	continueStudy: 'Daŭrigi studadon',

	rotateHint: 'Turnu la telefonon por pli bona vido',
	keepingAwake: 'La ekrano restos ŝaltita',
	todayStudyDay: 'Hodiaŭ',
	yesterdayLabel: 'Hieraŭ',
	monthDayLabel: '{d}/{m}',
	streakDays: 'Tagoj sinsekve',
	exitFocus: 'Eliri',
	enterFocus: 'Fokusa reĝimo',
  },

  ru: {
	appName: 'PomoDoroto',
	timerTab: 'Таймер',
	statsTab: 'Статистика',
	start: 'Старт',
	pause: 'Пауза',
	reset: 'Сброс',
	finish: 'ЗАВЕРШИТЬ',
	workCompleted: 'Рабочая сессия завершена!',
	breakCompleted: 'Перерыв завершен!',
	workSession: 'Рабочая Сессия',
	breakTime: 'Перерыв',
	notificationWorkBody: 'Время отдохнуть!',
	notificationBreakBody: 'Готов к работе!',
	confirmFinish: 'Завершить Сессию?',
	confirmFinishMessage: 'Вы уверены, что хотите завершить эту сессию Помодоро досрочно?',
	selectCategory: 'Выберите Метку',
	addTag: 'Добавить Метку',
	tagPlaceholder: 'Добавьте метку (работа, учёба, спорт...)',
	add: 'Добавить',
	cancel: 'Отмена',
	deleteTagTitle: 'Удалить Метку?',
	deleteTagMessage: 'Вы уверены, что хотите удалить',
	tagNameEmpty: 'Название метки не может быть пустым',
	tagNameDuplicate: 'Метка с таким названием уже существует',
	statsTitle: 'Ваша Статистика Помодоро',
	overall: 'Общая',
	byCategory: 'По Меткам',
	totalSessions: 'Всего Сессий:',
	totalTime: 'Общее Время:',
	sessions: 'сессий',
	ofTotalSessions: 'от общего числа сессий',
	noSessionsYet: 'Завершенных сессий пока нет. Запустите таймер, чтобы увидеть статистику!',
	settings: 'Настройки',
	settingsTitle: 'Настройки',
	darkMode: 'Тёмный Режим',
	language: 'Язык',
	workDuration: 'Продолжительность Работы',
	breakDuration: 'Продолжительность Перерыва',
	minutes: 'минут',
	soundEffects: 'Звуковые Эффекты',
	clearData: 'Сбросить Таймер',
	clearDataConfirm: 'Это сбросит таймер и настройки.',
	save: 'Сохранить',
	close: 'Закрыть',
	sessionNotePlaceholder: 'Добавьте заметку об этом помодоро...',
	sessionHistory: 'История Сессий',
	allSessions: 'Все',
	errorBoundaryTitle: 'Что-то пошло не так',
	errorBoundaryMessage: 'В этом разделе произошла ошибка. Вы можете попробовать снова или перезагрузить страницу.',
	errorBoundaryReset: 'Попробовать снова',

	dailySummary: 'Итоги Дня',
	todayStudy: 'Сегодня изучено',
	todayPomodoros: 'Помодоро сегодня',
	activeDays: 'Активных дней',
	dailyHistory: 'История по дням',
	noRecordToday: 'Сегодня ещё нет записей. Начните!',
	times: 'сессий',
	hourShort: 'ч',
	minuteShort: 'мин',

	workDoneTitle: 'Фокус завершён!',
	breakDoneTitle: 'Перерыв завершён!',
	workDoneBody: 'Отличная работа — отдохните.',
	breakDoneBody: 'Перерыв закончился. Снова за учёбу!',
	startBreak: 'Начать перерыв',
	continueStudy: 'Продолжить учёбу',

	rotateHint: 'Поверните телефон для лучшего вида',
	keepingAwake: 'Экран будет оставаться включённым',
	todayStudyDay: 'Сегодня',
	yesterdayLabel: 'Вчера',
	monthDayLabel: '{d}.{m}',
	streakDays: 'Дней подряд',
	exitFocus: 'Выйти',
	enterFocus: 'Режим фокуса',
  },
};

export const LANGUAGES = Object.keys(translations) as Language[];

/** Display names for the language picker. */
export const LANGUAGE_LABELS: Record<Language, string> = {
  zh: '简体中文',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  eo: 'Esperanto',
  ru: 'Русский',
};

/** Picks the best starting language from the device locale. */
export function detectLanguage(): Language {
  const nav = typeof navigator !== 'undefined' ? navigator.language : 'zh';
  if (nav && nav.toLowerCase().startsWith('zh')) return 'zh';
  const short = (nav || 'en').slice(0, 2) as Language;
  return (LANGUAGES as string[]).includes(short) ? short : 'en';
}

export function getTranslations(language: Language): Translations {
  return translations[language] ?? translations.zh;
}
