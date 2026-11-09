// Сгенерировано из таблиц ГНС «Сумма налога на основе патента для индивидуальной трудовой деятельности»
// (документ №512 от 12.09.2025, у Кара-Суйского района — от 25.04.2025), sti.gov.kg → Электронный патент →
// Ставки патентов; API: /api/Documents/get-documents-by-theme-id. Сверено 09.11.2026.
// Числа — столбец «Сумма налога» (сом на 30 дней), без базовой суммы. Несколько чисел = зоны внутри
// района или города (райцентр, айылные аймаки): ставка зависит от населённого пункта.
// Опечатки таблиц перенесены как есть (например, швея в Сокулукском районе 700 / 1000).

export type PatentActivityId =
  | 'hairdresser'
  | 'taxi'
  | 'shoe_repair'
  | 'tailoring'
  | 'photo'
  | 'computer_repair'
  | 'tutoring'
  | 'phone_repair';

export const PATENT_ACTIVITIES: { id: PatentActivityId; nameKey: string }[] = [
  { id: 'hairdresser', nameKey: 'patent_activity_hairdresser' },
  { id: 'taxi', nameKey: 'patent_activity_taxi' },
  { id: 'shoe_repair', nameKey: 'patent_activity_shoe_repair' },
  { id: 'tailoring', nameKey: 'patent_activity_tailoring' },
  { id: 'photo', nameKey: 'patent_activity_photo' },
  { id: 'computer_repair', nameKey: 'patent_activity_computer_repair' },
  { id: 'tutoring', nameKey: 'patent_activity_tutoring' },
  { id: 'phone_repair', nameKey: 'patent_activity_phone_repair' },
];

export const PATENT_OBLASTS: { id: string; nameKey: string }[] = [
  { id: 'bishkek', nameKey: 'region_bishkek' },
  { id: 'osh', nameKey: 'region_osh' },
  { id: 'batken', nameKey: 'region_batken_region' },
  { id: 'jalal_abad', nameKey: 'region_jalal_abad_region' },
  { id: 'issyk_kul', nameKey: 'region_issyk_kul_region' },
  { id: 'naryn', nameKey: 'region_naryn_region' },
  { id: 'osh_region', nameKey: 'region_osh_region' },
  { id: 'talas', nameKey: 'region_talas_region' },
  { id: 'chui', nameKey: 'region_chui_region' },
];

export interface PatentTerritory {
  id: string;
  oblast: string;
  name: { ru: string; ky: string };
  rates: Record<PatentActivityId, number[]>;
}

export const PATENT_TERRITORIES: PatentTerritory[] = [
  { id: 'bishkek-oktyabr', oblast: 'bishkek', name: { ru: 'Бишкек, Октябрьский район', ky: 'Бишкек, Октябрь району' }, rates: {
    hairdresser: [2000], taxi: [500], shoe_repair: [1000], tailoring: [700], photo: [3000], computer_repair: [3000], tutoring: [600], phone_repair: [2000]
  } },
  { id: 'bishkek-lenin', oblast: 'bishkek', name: { ru: 'Бишкек, Ленинский район', ky: 'Бишкек, Ленин району' }, rates: {
    hairdresser: [2000], taxi: [500], shoe_repair: [1000], tailoring: [700], photo: [3000], computer_repair: [3000], tutoring: [600], phone_repair: [2000]
  } },
  { id: 'bishkek-sverdlov', oblast: 'bishkek', name: { ru: 'Бишкек, Свердловский район', ky: 'Бишкек, Свердлов району' }, rates: {
    hairdresser: [2000], taxi: [500], shoe_repair: [1000], tailoring: [700], photo: [3000], computer_repair: [3000], tutoring: [600], phone_repair: [2000]
  } },
  { id: 'bishkek-pervomay', oblast: 'bishkek', name: { ru: 'Бишкек, Первомайский район', ky: 'Бишкек, Биринчи май району' }, rates: {
    hairdresser: [2000], taxi: [500], shoe_repair: [1000], tailoring: [700], photo: [3000], computer_repair: [3000], tutoring: [600], phone_repair: [2000]
  } },
  { id: 'osh', oblast: 'osh', name: { ru: 'г. Ош', ky: 'Ош шаары' }, rates: {
    hairdresser: [1400], taxi: [500], shoe_repair: [700], tailoring: [500], photo: [1000], computer_repair: [3500], tutoring: [500], phone_repair: [1200]
  } },
  { id: 'batken-city', oblast: 'batken', name: { ru: 'г. Баткен', ky: 'Баткен шаары' }, rates: {
    hairdresser: [1500], taxi: [300], shoe_repair: [300], tailoring: [240], photo: [900], computer_repair: [1500], tutoring: [180], phone_repair: [1200]
  } },
  { id: 'batken-district', oblast: 'batken', name: { ru: 'Баткенский район', ky: 'Баткен району' }, rates: {
    hairdresser: [400], taxi: [100], shoe_repair: [150], tailoring: [150], photo: [300], computer_repair: [500], tutoring: [200], phone_repair: [400]
  } },
  { id: 'sulukta', oblast: 'batken', name: { ru: 'г. Сулюкта', ky: 'Сүлүктү шаары' }, rates: {
    hairdresser: [2000], taxi: [300], shoe_repair: [600], tailoring: [500], photo: [1000], computer_repair: [1000], tutoring: [240], phone_repair: [1500]
  } },
  { id: 'kyzyl-kiya', oblast: 'batken', name: { ru: 'г. Кызыл-Кия', ky: 'Кызыл-Кыя шаары' }, rates: {
    hairdresser: [800, 500], taxi: [200, 200], shoe_repair: [600, 300], tailoring: [500, 300], photo: [2000, 1000], computer_repair: [1500, 600], tutoring: [500, 200], phone_repair: [1000, 500]
  } },
  { id: 'leilek', oblast: 'batken', name: { ru: 'Лейлекский район', ky: 'Лейлек району' }, rates: {
    hairdresser: [1600, 1000, 800], taxi: [300, 300, 300], shoe_repair: [300, 200, 100], tailoring: [700, 500, 500], photo: [900, 600, 300], computer_repair: [1500, 1000, 500], tutoring: [400, 300, 200], phone_repair: [1200, 800, 400]
  } },
  { id: 'kadamjay', oblast: 'batken', name: { ru: 'Кадамжайский район', ky: 'Кадамжай району' }, rates: {
    hairdresser: [1200, 1000], taxi: [150, 150], shoe_repair: [500, 400], tailoring: [500, 400], photo: [2000, 1000], computer_repair: [1500, 1000], tutoring: [1200, 1200], phone_repair: [1200, 1000]
  } },
  { id: 'jalal-abad-city', oblast: 'jalal_abad', name: { ru: 'г. Жалал-Абад', ky: 'Жалал-Абад шаары' }, rates: {
    hairdresser: [1100, 200], taxi: [300, 300], shoe_repair: [800, 200], tailoring: [700, 200], photo: [1900, 400], computer_repair: [3200, 600], tutoring: [600, 100], phone_repair: [1800, 600]
  } },
  { id: 'mailuu-suu', oblast: 'jalal_abad', name: { ru: 'г. Майлуу-Суу', ky: 'Майлуу-Суу шаары' }, rates: {
    hairdresser: [600, 200], taxi: [300, 300], shoe_repair: [300, 100], tailoring: [210, 70], photo: [900, 300], computer_repair: [1500, 500], tutoring: [180, 60], phone_repair: [1200, 400]
  } },
  { id: 'ala-buka', oblast: 'jalal_abad', name: { ru: 'Ала-Букинский район', ky: 'Ала-Бука району' }, rates: {
    hairdresser: [750, 250], taxi: [300, 300], shoe_repair: [400, 200], tailoring: [300, 200], photo: [1000, 400], computer_repair: [1700, 700], tutoring: [300, 150], phone_repair: [1500, 600]
  } },
  { id: 'toguz-toro', oblast: 'jalal_abad', name: { ru: 'Тогуз-Тороуский район', ky: 'Тогуз-Торо району' }, rates: {
    hairdresser: [600, 200], taxi: [300, 100], shoe_repair: [600, 200], tailoring: [210, 70], photo: [900, 300], computer_repair: [1500, 500], tutoring: [600, 200], phone_repair: [1200, 400]
  } },
  { id: 'tash-kumyr', oblast: 'jalal_abad', name: { ru: 'г. Таш-Кумыр', ky: 'Таш-Көмүр шаары' }, rates: {
    hairdresser: [600], taxi: [400], shoe_repair: [400], tailoring: [700], photo: [1200], computer_repair: [2000], tutoring: [240], phone_repair: [1600]
  } },
  { id: 'chatkal', oblast: 'jalal_abad', name: { ru: 'Чаткальский район', ky: 'Чаткал району' }, rates: {
    hairdresser: [1000], taxi: [100], shoe_repair: [100], tailoring: [500], photo: [300], computer_repair: [500], tutoring: [600], phone_repair: [700]
  } },
  { id: 'nooken', oblast: 'jalal_abad', name: { ru: 'Ноокенский район', ky: 'Ноокен району' }, rates: {
    hairdresser: [600], taxi: [300], shoe_repair: [500], tailoring: [700], photo: [1500], computer_repair: [1500], tutoring: [500], phone_repair: [1200]
  } },
  { id: 'suzak', oblast: 'jalal_abad', name: { ru: 'Сузакский район', ky: 'Сузак району' }, rates: {
    hairdresser: [1200, 800, 300], taxi: [300, 300, 300], shoe_repair: [600, 500, 400], tailoring: [700, 700, 700], photo: [1200, 360, 600], computer_repair: [2000, 600, 800], tutoring: [600, 450, 300], phone_repair: [2000, 600, 800]
  } },
  { id: 'toktogul', oblast: 'jalal_abad', name: { ru: 'Токтогульский район', ky: 'Токтогул району' }, rates: {
    hairdresser: [600, 400], taxi: [300, 100], shoe_repair: [300, 100], tailoring: [210, 70], photo: [900, 300], computer_repair: [1500, 500], tutoring: [180, 60], phone_repair: [900, 300]
  } },
  { id: 'bazar-korgon', oblast: 'jalal_abad', name: { ru: 'Базар-Коргонский район', ky: 'Базар-Коргон району' }, rates: {
    hairdresser: [1000, 600, 800], taxi: [375, 300, 300], shoe_repair: [500, 300, 400], tailoring: [350, 210, 280], photo: [750, 500, 600], computer_repair: [2500, 1500, 2000], tutoring: [300, 180, 240], phone_repair: [750, 600, 600]
  } },
  { id: 'aksy', oblast: 'jalal_abad', name: { ru: 'Аксыйский район', ky: 'Аксы району' }, rates: {
    hairdresser: [600, 300], taxi: [300, 100], shoe_repair: [300, 100], tailoring: [300, 150], photo: [900, 300], computer_repair: [1500, 500], tutoring: [180, 60], phone_repair: [1200, 400]
  } },
  { id: 'kara-kul', oblast: 'jalal_abad', name: { ru: 'г. Кара-Куль', ky: 'Кара-Көл шаары' }, rates: {
    hairdresser: [800], taxi: [400], shoe_repair: [400], tailoring: [280], photo: [1200], computer_repair: [2000], tutoring: [240], phone_repair: [1600]
  } },
  { id: 'naryn-city', oblast: 'naryn', name: { ru: 'г. Нарын', ky: 'Нарын шаары' }, rates: {
    hairdresser: [600], taxi: [120], shoe_repair: [400], tailoring: [280], photo: [1200], computer_repair: [1000], tutoring: [600], phone_repair: [600]
  } },
  { id: 'naryn-district', oblast: 'naryn', name: { ru: 'Нарынский район', ky: 'Нарын району' }, rates: {
    hairdresser: [500], taxi: [100], shoe_repair: [100], tailoring: [300], photo: [300], computer_repair: [500], tutoring: [500], phone_repair: [400]
  } },
  { id: 'kochkor', oblast: 'naryn', name: { ru: 'Кочкорский район', ky: 'Кочкор району' }, rates: {
    hairdresser: [500, 200], taxi: [300, 100], shoe_repair: [300, 100], tailoring: [300, 100], photo: [900, 300], computer_repair: [1500, 500], tutoring: [200, 100], phone_repair: [1200, 400]
  } },
  { id: 'at-bashy', oblast: 'naryn', name: { ru: 'Ат-Башинский район', ky: 'Ат-Башы району' }, rates: {
    hairdresser: [600, 400], taxi: [150, 150], shoe_repair: [300, 200], tailoring: [500, 250], photo: [1500, 750], computer_repair: [2500, 1500], tutoring: [600, 400], phone_repair: [1100, 550]
  } },
  { id: 'jumgal', oblast: 'naryn', name: { ru: 'Жумгальский район', ky: 'Жумгал району' }, rates: {
    hairdresser: [200, 200], taxi: [100, 100], shoe_repair: [200, 200], tailoring: [300, 300], photo: [600, 600], computer_repair: [300, 300], tutoring: [200, 200], phone_repair: [300, 300]
  } },
  { id: 'ak-tala', oblast: 'naryn', name: { ru: 'Ак-Талинский район', ky: 'Ак-Талаа району' }, rates: {
    hairdresser: [800, 800], taxi: [200, 200], shoe_repair: [300, 300], tailoring: [500, 500], photo: [600, 600], computer_repair: [800, 800], tutoring: [300, 300], phone_repair: [600, 600]
  } },
  { id: 'uzgen', oblast: 'osh_region', name: { ru: 'Узгенский район', ky: 'Өзгөн району' }, rates: {
    hairdresser: [1000, 400, 120, 12], taxi: [100, 100, 100, 100], shoe_repair: [500, 200, 60, 6], tailoring: [350, 140, 42, 4.2], photo: [1500, 600, 180, 18], computer_repair: [2500, 1000, 300, 30], tutoring: [300, 120, 36, 3.6], phone_repair: [2000, 800, 240, 24]
  } },
  { id: 'kara-kulja', oblast: 'osh_region', name: { ru: 'Кара-Кульджинский район', ky: 'Кара-Кулжа району' }, rates: {
    hairdresser: [600, 60], taxi: [300, 300], shoe_repair: [300, 30], tailoring: [210, 21], photo: [900, 90], computer_repair: [1500, 150], tutoring: [180, 18], phone_repair: [1200, 120]
  } },
  { id: 'nookat', oblast: 'osh_region', name: { ru: 'Ноокатский район', ky: 'Ноокат району' }, rates: {
    hairdresser: [800, 600, 200], taxi: [400, 400, 400], shoe_repair: [400, 300, 100], tailoring: [300, 300, 300], photo: [1200, 900, 300], computer_repair: [2000, 1500, 500], tutoring: [240, 180, 60], phone_repair: [1600, 1200, 400]
  } },
  { id: 'aravan', oblast: 'osh_region', name: { ru: 'Араванский район', ky: 'Араван району' }, rates: {
    hairdresser: [800, 600, 200], taxi: [400, 400, 400], shoe_repair: [400, 300, 100], tailoring: [280, 210, 70], photo: [1200, 900, 300], computer_repair: [2000, 1500, 1000], tutoring: [240, 200, 200], phone_repair: [1600, 1200, 400]
  } },
  { id: 'chon-alay', oblast: 'osh_region', name: { ru: 'Чон-Алайский район', ky: 'Чоң-Алай району' }, rates: {
    hairdresser: [200], taxi: [100], shoe_repair: [100], tailoring: [100], photo: [300], computer_repair: [500], tutoring: [600], phone_repair: [400]
  } },
  { id: 'alay', oblast: 'osh_region', name: { ru: 'Алайский район', ky: 'Алай району' }, rates: {
    hairdresser: [600, 200], taxi: [300, 300], shoe_repair: [300, 100], tailoring: [700, 700], photo: [900, 300], computer_repair: [1200, 400], tutoring: [300, 100], phone_repair: [1200, 400]
  } },
  { id: 'kara-suu', oblast: 'osh_region', name: { ru: 'Кара-Суйский район', ky: 'Кара-Суу району' }, rates: {
    hairdresser: [1000, 1000, 800], taxi: [500, 500, 500], shoe_repair: [400, 300, 200], tailoring: [600, 600, 300], photo: [1200, 1200, 300], computer_repair: [2000, 2000, 500], tutoring: [600, 600, 500], phone_repair: [2000, 2000, 400]
  } },
  { id: 'talas-city', oblast: 'talas', name: { ru: 'г. Талас', ky: 'Талас шаары' }, rates: {
    hairdresser: [1000], taxi: [300], shoe_repair: [500], tailoring: [700], photo: [1500], computer_repair: [1500], tutoring: [600], phone_repair: [1000]
  } },
  { id: 'talas-district', oblast: 'talas', name: { ru: 'Таласский район', ky: 'Талас району' }, rates: {
    hairdresser: [700], taxi: [300], shoe_repair: [600], tailoring: [300], photo: [1000], computer_repair: [1000], tutoring: [600], phone_repair: [1000]
  } },
  { id: 'aitmatov', oblast: 'talas', name: { ru: 'Айтматовский район', ky: 'Айтматов району' }, rates: {
    hairdresser: [700], taxi: [300], shoe_repair: [500], tailoring: [500], photo: [1000], computer_repair: [2000], tutoring: [300], phone_repair: [1000]
  } },
  { id: 'manas', oblast: 'talas', name: { ru: 'Манасский район', ky: 'Манас району' }, rates: {
    hairdresser: [1000], taxi: [300], shoe_repair: [500], tailoring: [300], photo: [700], computer_repair: [1000], tutoring: [300], phone_repair: [800]
  } },
  { id: 'bakai-ata', oblast: 'talas', name: { ru: 'Бакай-Атинский район', ky: 'Бакай-Ата району' }, rates: {
    hairdresser: [500], taxi: [300], shoe_repair: [400], tailoring: [300], photo: [900], computer_repair: [600], tutoring: [500], phone_repair: [400]
  } },
  { id: 'kemin', oblast: 'chui', name: { ru: 'Кеминский район', ky: 'Кемин району' }, rates: {
    hairdresser: [2000], taxi: [500], shoe_repair: [500], tailoring: [700], photo: [1200], computer_repair: [1200], tutoring: [600], phone_repair: [1200]
  } },
  { id: 'tokmok', oblast: 'chui', name: { ru: 'г. Токмок', ky: 'Токмок шаары' }, rates: {
    hairdresser: [2000], taxi: [500], shoe_repair: [700], tailoring: [700], photo: [1500], computer_repair: [2000], tutoring: [600], phone_repair: [2000]
  } },
  { id: 'alamedin', oblast: 'chui', name: { ru: 'Аламединский район', ky: 'Аламүдүн району' }, rates: {
    hairdresser: [1500], taxi: [400], shoe_repair: [600], tailoring: [300], photo: [1500], computer_repair: [3200], tutoring: [600], phone_repair: [2200]
  } },
  { id: 'chui-district', oblast: 'chui', name: { ru: 'Чуйский район', ky: 'Чүй району' }, rates: {
    hairdresser: [600, 400], taxi: [500, 500], shoe_repair: [500, 300], tailoring: [300, 300], photo: [1300, 900], computer_repair: [1300, 1000], tutoring: [600, 400], phone_repair: [1500, 1300]
  } },
  { id: 'ysyk-ata', oblast: 'chui', name: { ru: 'Ысык-Атинский район', ky: 'Ысык-Ата району' }, rates: {
    hairdresser: [2000, 1800, 1500, 700], taxi: [500, 500, 500, 500], shoe_repair: [1000, 1000, 1000, 1000], tailoring: [700, 700, 700, 700], photo: [2000, 1800, 1400, 1200], computer_repair: [3000, 2500, 2300, 2200], tutoring: [600, 600, 600, 600], phone_repair: [3000, 2500, 2000, 1000]
  } },
  { id: 'sokuluk', oblast: 'chui', name: { ru: 'Сокулукский район', ky: 'Сокулук району' }, rates: {
    hairdresser: [1500], taxi: [500, 500], shoe_repair: [1000, 1000], tailoring: [700, 1000], photo: [1500, 1000], computer_repair: [3000, 2000], tutoring: [600, 600], phone_repair: [2000, 1500]
  } },
  { id: 'jaiyl', oblast: 'chui', name: { ru: 'Жайылский район', ky: 'Жайыл району' }, rates: {
    hairdresser: [800], taxi: [500], shoe_repair: [500], tailoring: [700], photo: [1500], computer_repair: [2000], tutoring: [500], phone_repair: [2000]
  } },
  { id: 'panfilov', oblast: 'chui', name: { ru: 'Панфиловский район', ky: 'Панфилов району' }, rates: {
    hairdresser: [1000], taxi: [500], shoe_repair: [500], tailoring: [700], photo: [900], computer_repair: [1000], tutoring: [600], phone_repair: [800]
  } },
  { id: 'moskovsky', oblast: 'chui', name: { ru: 'Московский район', ky: 'Москва району' }, rates: {
    hairdresser: [1000, 800], taxi: [500, 500], shoe_repair: [500, 300], tailoring: [500, 500], photo: [1200, 1200], computer_repair: [1600, 1600], tutoring: [600, 600], phone_repair: [2000, 1800]
  } },
  { id: 'balykchy', oblast: 'issyk_kul', name: { ru: 'г. Балыкчы', ky: 'Балыкчы шаары' }, rates: {
    hairdresser: [800], taxi: [200], shoe_repair: [400], tailoring: [700], photo: [1000], computer_repair: [1600], tutoring: [600], phone_repair: [1000]
  } },
  { id: 'issyk-kul-district', oblast: 'issyk_kul', name: { ru: 'Иссык-Кульский район', ky: 'Ысык-Көл району' }, rates: {
    hairdresser: [600, 1000], taxi: [350, 350], shoe_repair: [650, 850], tailoring: [300, 300], photo: [2000, 2500], computer_repair: [3000, 5000], tutoring: [480, 600], phone_repair: [2500, 4000]
  } },
  { id: 'tyup', oblast: 'issyk_kul', name: { ru: 'Тюпский район', ky: 'Түп району' }, rates: {
    hairdresser: [600, 300], taxi: [329, 329], shoe_repair: [500, 350], tailoring: [210, 150], photo: [900, 300], computer_repair: [750, 500], tutoring: [500, 250], phone_repair: [950, 400]
  } },
  { id: 'karakol', oblast: 'issyk_kul', name: { ru: 'г. Каракол', ky: 'Каракол шаары' }, rates: {
    hairdresser: [1000], taxi: [200], shoe_repair: [500], tailoring: [700], photo: [1000], computer_repair: [2000], tutoring: [600], phone_repair: [1000]
  } },
  { id: 'ak-suu', oblast: 'issyk_kul', name: { ru: 'Ак-Суйский район', ky: 'Ак-Суу району' }, rates: {
    hairdresser: [500], taxi: [200], shoe_repair: [420], tailoring: [300], photo: [700], computer_repair: [1000], tutoring: [600], phone_repair: [1000]
  } },
  { id: 'jeti-oguz', oblast: 'issyk_kul', name: { ru: 'Жети-Огузский район', ky: 'Жети-Өгүз району' }, rates: {
    hairdresser: [1200, 600], taxi: [250, 250], shoe_repair: [1000, 1000], tailoring: [700, 700], photo: [1800, 1500], computer_repair: [1500, 1500], tutoring: [600, 600], phone_repair: [1200, 1200]
  } },
  { id: 'ton', oblast: 'issyk_kul', name: { ru: 'Тонский район', ky: 'Тоң району' }, rates: {
    hairdresser: [600, 600], taxi: [270, 270], shoe_repair: [300, 300], tailoring: [500, 500], photo: [900, 700], computer_repair: [1500, 1000], tutoring: [600, 500], phone_repair: [1200, 1000]
  } },
];

export const PATENT_RATES_SOURCE_URL = 'https://sti.gov.kg/';

export const findTerritory = (id: string): PatentTerritory =>
  PATENT_TERRITORIES.find(t => t.id === id) ?? PATENT_TERRITORIES[0];

export const patentRange = (territory: PatentTerritory, activity: PatentActivityId) => {
  const zones = territory.rates[activity];
  return { min: Math.min(...zones), max: Math.max(...zones) };
};
