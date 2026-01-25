-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: MySQL-8.2
-- Время создания: Янв 25 2026 г., 23:53
-- Версия сервера: 8.2.0
-- Версия PHP: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `laravel_diss`
--

-- --------------------------------------------------------

--
-- Структура таблицы `ai_logs`
--

CREATE TABLE `ai_logs` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `chat_id` bigint UNSIGNED DEFAULT NULL,
  `question` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `matched_titles` json DEFAULT NULL,
  `context` longtext COLLATE utf8mb4_unicode_ci,
  `final_answer` longtext COLLATE utf8mb4_unicode_ci,
  `error` text COLLATE utf8mb4_unicode_ci,
  `duration_ms` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `chapters`
--

CREATE TABLE `chapters` (
  `id` bigint UNSIGNED NOT NULL,
  `document_id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Новая глава',
  `content` json DEFAULT NULL,
  `open` tinyint(1) NOT NULL DEFAULT '1',
  `position` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `chapters`
--

INSERT INTO `chapters` (`id`, `document_id`, `title`, `content`, `open`, `position`, `created_at`, `updated_at`) VALUES
(1, 1, 'НАИМЕНОВАНИЕ ДОКУМЕНТА', '[{\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"Документированная процедура «Обеспечение безопасности жизнедеятельности» АТУ-АХВ-ДП-7.1.3.-2023-01.\"}]}]', 0, 1, '2025-12-27 02:23:09', '2026-01-25 09:11:00'),
(2, 1, 'РАЗРАБОТЧИК', '[{\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"Проректор по Административно-хозяйственной части.\"}]}, {\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"Отдел военно-учетного стола, гражданской защиты и чрезвычайных ситуаций.\"}]}]', 0, 2, '2025-12-27 13:24:46', '2026-01-25 09:11:00'),
(3, 1, 'ЦЕЛЬ РАЗРАБОТКИ ДОКУМЕНТА', '[{\"type\": \"paragraph\", \"children\": [{\"text\": \"Настоящая документированная процедура устанавливает требования по обеспечению безопасности жизнедеятельности, а также порядок реализации мероприятий, направленных на сохранение жизни и здоровья обучающихся и работающих при нормальном режиме работы и в чрезвычайных ситуациях и включает охрану труда, пожарную безопасность, защиту от чрезвычайных ситуаций природного и техногенного характера и гражданскую оборону.\"}]}]', 0, 3, '2025-12-27 13:24:54', '2026-01-25 09:11:00'),
(4, 1, 'НОРМАТИВНЫЕ ССЫЛКИ', '[{\"type\": \"paragraph\", \"children\": [{\"text\": \"МС ISО 9001:2015 «Система менеджмента качества. Требования»;\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"МС ISО 9000:2015 Система менеджмента качества. Основные положения и словарь;\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"МС ISО 19011:2018 «Руководящие указания по аудиту систем менеджмента»;\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"МС ISО 37001:2016 «Системы менеджмента противодействия коррупции. Требования и рекомендации по применению»;\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"ISO 27001:2022 « Информационная безопасность, кибербезопасность и защита персональных данных – Системы менеджмента информационной безопасности – Требования».\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"АТУ-УКиА-ДП-7.5-2023-02 «Документированная информация»;\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"АТУ-УКиА-ДП-10.2-2023-03 «Несоответствия и корректирующие действия»;\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"Политика в области качества, утвержденная советом директоров от 22.08.2022, протокол No 10.\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"Политика противодействия коррупции АО «АТУ» от 26.01.2022 г.;\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"АТУ-УКиА-ДП-5.2-2022-06 Политика информационной безопасности;\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"АТУ-УКиА-ИКП-5.3/9.3-2023-01 «Альбом информационных карт процессов»;\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"Закон РК «Об образовании» No 319-III от 27.07.2007 (с изменениями и дополнениями по состоянию на 10.09.2023 г.);\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"Устав АО «Алматинский технологический университет»;\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"СТ «Антикоррупционный стандарт АО «Алматинский технологический университет» АТУ-ПВРиСВ-СТ-7.5.1-2020-14;\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"Стратегический план развития АО «АТУ» 2022-2027 гг.;\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"Правила документирования, управления документацией и использования систем электронного документооборота в государственных и негосударственных организациях. (В редакции постановления Правительства РК от 31.08.2022 года).\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"Документированная процедура «Управление рисками» АТУ-УКиА-ДП-6.1-2021-10.\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"Закон РК «О гражданской защите» No188-V ЗРК от 11.04. 2014 г.\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"Приказ Министра обороны РК от 24 января 2017 года No28 «Об утверждении Правил воинского учета военнообязанных и призывников».\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"Закон РК от 16.02.2012 г. No 561 «О воинской службе и статусе военнослужащих».\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"Технический Регламент «Общие требования к Пожарной Безопасности» No 439 от 23.06. 2017 г.\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"Правила проведения обучения, инструктирования и проверок знаний работников по вопросам безопасности и охраны труда. (Приказ МЗ и СР РК от 25.12. 2015 г. No 1019).\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"Приказ Министра по чрезвычайным ситуациям Республики Казахстан от 21 февраля 2022 года No 55. Зарегистрирован в Министерстве юстиции Республики Казахстан 21 февраля 2022 года No 26867.\"}]}]', 0, 4, '2025-12-27 13:26:54', '2026-01-25 09:11:01'),
(5, 1, 'ТЕРМИНЫ И ОПРЕДЕЛЕНИЯ', '[{\"type\": \"paragraph\", \"children\": [{\"text\": \"\"}]}, {\"type\": \"table\", \"children\": [{\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Термины\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Определения\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Аттестация рабочих мест по условиям труда\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"– система учета, анализа и комплексной оценки на конкретном рабочем месте всех факторов производственной среды, тяжести и напряженности трудового процесса, воздействующих на работоспособность и здоровье работающего в процессе трудовой деятельности.\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Антикоррупционный стандарт АО «АТУ»\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Внутренний нормативный документ, определяющий действия и решения ППС, сотрудников и обучающихся, направленные на неукоснительное соблюдение установленных правил и предотвращение коррупционных проявлений в сфере образовательных услуг\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Антикоррупционная политика АО «АТУ»\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Правовые, административные и организационные меры, направленные на снижение коррупционных рисков, формирование антикоррупционной культуры, повышение доверия общества к деятельности АО «АТУ»\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Безопасность в чрезвычайных ситуациях\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"– состояние защищенности населения, субъектов хозяйствования и окружающей среды от опасностей в чрезвычайных ситуациях\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Безопасные условия труда\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"– условия труда, при которых исключено воздействие на работающих вредных и (или) опасных производственных факторов либо уровни их воздействия на работающих не превышают установленных нормативов.\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Воинский учет\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"-система учета и анализа количественных и качественных данных о призывниках, военнослужащих и мобилизационных ресурсах.\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Военнообязанные\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"- граждане РК, состоящие на воинском учете и прибывающие в запасе до предельного возраста\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Вредный производственный фактор\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"-производственный фактор, воздействие которого на работающего в производственном процессе в определенных условиях может привести к заболеванию, снижению работоспособности либо к смерти.\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Все сотрудники\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"- соблюдение мер Техники безопасности и Противопожарной Безопасности и Противопожарного Режима\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Гражданская оборона\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Система мероприятий по подготовке к защите и по защите населения, материальных и культурных ценностей от опасностей, возникающих при ведении военных действий или вследствие этих действий, а также при возникновении чрезвычайных ситуаций природного и техногенного характера.\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Гражданская защита\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Система мероприятий регулирующая общественные отношения, возникающие в процессе мероприятий по гражданской защите и направленные на предупреждение и ликвидацию чрезвычайных ситуаций природного и техногенного характера и их последствий;\"}]}, {\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"оказание экстренной медицинской и психологической помощи населению, находящемуся в зоне чрезвычайной ситуации; обеспечение пожарной и промышленной безопасности.\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Документированная\"}]}, {\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"процедура\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"-документ, устанавливающий единый для АО «АТУ» порядок описания процессов, полномочия и ответственность должностных лиц, информационные потоки, включая регистрацию данных и записей по качеству.\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Канцелярия\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"- рассылка актуализированной документации.\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Отдел ВУС, ГЗ и ЧС\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Структурное подразделение АО « АТУ», обеспечивает ведение воинского учета учащихся и служащих, организацию и осуществление мероприятий гражданской защиты и чрезвычайных ситуаций университета.\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Отдел ВУС, ГЗ и ЧС\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"- актуализация настоящего ДП\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Отдел управления\"}]}, {\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"персоналом\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"- контроль за постановкой на воинской учет и прохождением инструктажа по технике безопасности и пожарной безопасности вновь поступающих сотрудников\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Отдел регистрации\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"-своевременно обеспечивать информацией о перемещении студентов (копии приказов о зачислении, переводе, отчислении)\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Пожарная\"}]}, {\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"безопасность\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Система работ предотвращающая возможность возникновения и развития пожара на объектах АТУ.\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Призывники\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Граждане РК мужского пола, подлежащие призыву в Вооруженные Силы Республики Казахстан.\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Руководители СП\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"- обязаны обеспечить прибытие студентов первого курса для постановки на воинский учет;\"}]}, {\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"- представлять штатные формуляры к установленным срокам;\"}]}, {\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"- проводить инструктажи сотрудников на рабочем месте, записью в журнале;\"}]}, {\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"- информировать персонал о времени и месте проведении учений по ГЗ и ЧС;\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Система\"}]}, {\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"менеджмента\"}]}, {\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"качества\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Часть менеджмента, нацеленная на качество\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Система управления\"}]}, {\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"охраной труда\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Часть общей системы управления организации, обеспечивающая управления рисками в области охраны здоровья и безопасность труда.\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Структурное\"}]}, {\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"подразделение\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Организованно – выделенная часть юридического лица и относящихся к ней работники, выполняющие установленный для них круг трудовых обязанностей, отвечающие за выполнение закрепленных за ними функций.\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Чрезвычайная\"}]}, {\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"ситуация\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"это обстановка на определенной территории, сложившаяся в результате аварии, опасного природного явления\"}]}]}]}]}]', 0, 5, '2026-01-01 06:21:49', '2026-01-25 09:11:01'),
(6, 1, 'ИСПОЛЬЗОВАННЫЕ СОКРАЩЕНИЯ И ОБОЗНАЧЕНИЯ', '[{\"type\": \"paragraph\", \"children\": [{\"text\": \"\"}]}, {\"type\": \"table\", \"children\": [{\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Сокращение\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Полное наименование\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"АО «АТУ»\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Акционерное Общество «Алматинский технологический университет»\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"АТУ-УКиА-ИКП-5.3/9.3-2023-01\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"«Альбом информационных карт процессов»\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"АТУ-УКиА-ДП-7.5-2023-02\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Документированная процедура «Документированная информация»\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"АТУ-УКиА-ДП-10.2-2023-03\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Документированная процедура «Несоответствия и корректирующие действия»\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"АТУ-УКиА-ДП-6.1-2021-10\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Документированная процедура «Управление рисками»\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"АПС\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Автоматическая пожарная система.\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"АТУ\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Акционерное общество «Алматинский Технологический Университет».\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"АХВ\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Административно-хозяйственные вопросы\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"БЖД\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Безопасность жизнедеятельности\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"ГО\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Гражданская оборона.\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"ГЗ\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Гражданская защита.\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"ДЧС\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Департамент по Чрезвычайным ситуациям.\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"КШУ\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Командно-штабные учения.\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"КЧС\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Комитет по Чрезвычайным ситуациям.\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Настоящая ДП\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Документированная процедура «Обеспечение безопасности жизнедеятельности» АТУ-АХВ-ДП-7.1.3.-2023-01.\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"ОУП\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Отдел Управления Персоналом.\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"ОВУС, ГЗ и ЧС\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Отдел военно-учетного стола, гражданской защиты и Чрезвычайных ситуаций\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"ОР\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Офис Регистратор\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"ОТ\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Охрана Труда\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"ПБ\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Пожарная Безопасность\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"СП\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Структурное Подразделение\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"СМК\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Система Менеджмента и Качества\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"ТБ\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Техника безопасности\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"ТСУ\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Тактико-специальные учения\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"УКиА\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Управление качеством и аккредитации\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"УДО (ОДО)\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Управление по делам обороны (отдел по делам обороны)\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"УПОиПК\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Управление правового обеспечения и противодействия коррупции\"}]}]}]}]}]', 0, 6, '2026-01-02 00:50:12', '2026-01-25 09:11:01'),
(7, 1, 'ОБЩИЕ ПОЛОЖЕНИЯ', '[{\"type\": \"paragraph\", \"children\": [{\"text\": \"Обеспечение БЖД ставит следующие цели:\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"сохранение жизни и здоровья работающих и обучающихся АО « АТУ»;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"здоровые и безопасные условия труда работающих;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"отсутствие производственного травматизма;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"готовность к действиям в ЧС;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"защита здоровья и жизни персонала и посетителей;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"сохранность материальных средств и имущества\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"обеспечение гражданской обороны и защиты в случаях чрезвычайных ситуаций природного и техногенного характера в условиях АО «АТУ»;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"обеспечение мер технической и пожарной безопасности;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"реализация воинского учета военнообязанных обучающихся и сотрудников.\"}]}, {\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"Требования настоящей ДП распространяются на все СП, должностные лица и сотрудников и обучающихся АО « АТУ».\"}]}, {\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"Процедуру воинского учета, ГЗ и ЧС, а также ТБ и ПБ проходит весь обучающийся, обучаемый и обслуживающий персонал АО « АТУ».\"}]}, {\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"Управление обеспечением пожарной безопасности в АО «АТУ» осуществляется ректором через службу ТБ и ПБ, непосредственным руководителем которой является проректор по АХВ.\"}]}]', 0, 7, '2026-01-02 00:50:12', '2026-01-25 09:11:01'),
(8, 1, 'ОПИСАНИЕ ПРОЦЕДУРЫ', '[{\"type\": \"paragraph\", \"children\": [{\"text\": \"В основе методологии создания и функционирования системы управления охраной труда положены известные принципы: «планируй – выполняй – контролируй - совершенствуй», реализуемые в рамках политики АО « АТУ» в области охраны труда.\"}]}, {\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"Обеспечение БЖД при нормальном режиме работы и в ЧС реализуется по следующим этапам:\"}]}, {\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"Политика АО «АТУ» в области БЖД основывается на государственном приоритете сохранения жизни и здоровья человека, как при нормальных режимах работы, так и в чрезвычайных ситуациях. Политика АО «АТУ» в области БЖД включает:\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"создание системы управления БЖД на всех уровнях, СП.\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"управление БЖД с учетом требований законодательных и иных нормативных правовых актов в области безопасности и гигиены труда, производственной санитарии, пожарной безопасности, гражданской обороны;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"обеспечение предусмотренных законодательством прав работников на безопасные и безвредные условия труда;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"постоянное совершенствование и повышение эффективности управления БЖД;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"непрерывное повышение уровня работы по предупреждению травматизма, заболеваемости и аварийности;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"последовательное улучшение условий труда, снижение риска травматизма и профессиональных заболеваний на основе управления деятельностью по БЖД;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"приоритетное финансирование мероприятий по улучшению условий труда и БЖД;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"организация безопасного отдыха, досуга, культурно-массовой и просветительской деятельности;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"обеспечение сохранности материальных ценностей, защита здоровья и жизни персонала и посетителей;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"предотвращение или минимизация последствий возможных ЧС для обучающихся и работающих.\"}]}, {\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"Планирование мероприятий по обеспечению БЖД. На этом этапе управления предусматривается разработка и выдача заданий СП и отдельным должностным лицам на текущий период и на перспективу. Планирование мероприятий по обеспечению БЖД состоит из:\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"ежегодной разработки планов мероприятий и программ по БЖД, а при необходимости, и на иной период;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"ежегодной разработки планов мероприятий по ОТ;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"ежегодному к 1 декабрю составлению планов проведения учений и тренировок в области ГЗ и ЧС на учебный год по форме Ф. АХВ- 7.1.3- 2023-01-01;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"ежегодное планирование подготовки руководящего и командного состава формирований ГЗ и ЧС и составление заявки на следующий учебный год по форме Ф. АХВ- 7.1.3- 2023-01-02;\"}]}, {\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"Осуществление мероприятий по обеспечению БЖД Мероприятия по БЖД включают:\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"выявление опасных и вредных факторов, воздействующих на работающих;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"проведение анализа состояния условий и охраны труда работающих;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"идентификация и оценка производственных рисков;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"проведение периодического контроля над состоянием БЖД в СП АТУ;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"обучение, инструктаж, стажировка, проверка знаний и тренировка по БЖД различных категорий работающих АО « АТУ»;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"координация деятельности по БЖД всех СП АО «АТУ»;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"организация аттестации рабочих мест по условиям труда;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"организация расследования несчастных случаев на производстве и в быту;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"составление отчетности по ОТ по установленной форме;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"организация ежегодного медицинского обследования сотрудников, работающих с опасными и вредными факторами;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"обеспечение ежедневным и профилактическим питанием, средствами индивидуальной защиты отдельных категорий работающих;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"обеспечение пожарной безопасности в СП и на территории АО «АТУ»;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"обеспечение безопасного функционирования АО «АТУ»;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"обеспечение безопасности работы оборудования с повышенной опасностью;\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"расчет смет расходов, необходимых для выполнения планов мероприятий по БЖД.\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"обеспечение контроля над военнообязанными и призывниками, выполнения Закона РК «О воинской службе и статусе военнослужащих».\"}]}, {\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"Контроль над выполнением мероприятий по обеспечению БЖД осуществляется руководителями СП и ОВУС, ГЗ и ЧС, проректором АХВ, ответственными за состояние БЖД в соответствии с действующим законодательством. Ежедневный, ежемесячный, ежеквартальный контроль состояния БЖД проводится руководителями соответствующих СП АО « АТУ». На основании полученной информации о состоянии условий труда, травматизма и заболеваемости, степени выполнения работающими своих обязанностей по обеспечению БЖД, другой информации, относящейся к деятельности по БЖД, осуществляются корректирующие действия, направленные на достижение более высоких результатов по улучшению состояния БЖД в АО «АТУ».\"}]}, {\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"Основные требования по организации работ по обеспечению ПБ и соблюдению мер ТБ.\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"С целью недопущения возникновения очагов пожара в зданиях, на территориях, прилегающих к учебным корпусам и решения других задач, в АО «АТУ» осуществляется визуальный и технический контроль за соблюдение противопожарного режима на объектах и учебных корпусах.\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"Для обеспечения ПБ, учебные корпуса АО «АТУ» оснащены АПС, с установкой на каждом этаже кнопок пожарной сигнализации.\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"При возникновении задымления или очага пожара, автоматически или при нажатии на кнопку ручного извещателя, соответствующий сигнал поступает на пульт АПС, установленный в помещении охраны, что позволяет оперативно определить местонахождение очага пожара и принять меры по его ликвидации.\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"В учебных корпусах АО «АТУ» смонтирована оборудованная система звукового оповещения, позволяющее дежурным охранникам довести до сведения всех находящихся в зданиях людей информацию о пожаре и порядке эвакуации.\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"Со всеми сотрудниками при оформлении на работу в АО «АТУ» проводится вводный инструктаж по ТБ и ПБ, о чем делается запись в «Журнале регистрации вводного инструктажа по технике безопасности» Ф. АХВ-7.1.3- 2023-01-03. и в «Журнале учета проведения инструктажей по пожарной безопасности» по форме Ф. АХВ-7.1.3- 2023-01-04.\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"Последующие инструктажи производятся на рабочем месте руководителем СП, с записью в «Журнале регистрации инструктажа по и техники безопасности на рабочем месте» по форме Ф. АХВ-7.1.3- 2023-01-05.\"}]}, {\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"Контроль над военнообязанными и призывниками в АО « АТУ»\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"В АО «АТУ» организован воинский учет всех обучающихся и работающих военнообязанных и призывников, согласно требованиям Постановления Правительства РК «Об утверждении правил организации и проведения призыва граждан РК на воинскую службу» и исполнение данного учета возложено на ОВУС, ГЗ и ЧС.\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"Постановка на воинский учет в ОВУС, ГЗ и ЧС организована следующим образом:\"}]}, {\"type\": \"paragraph\", \"level\": 4, \"children\": [{\"text\": \"ОУП, при приеме на работу в АО «АТУ\\\", всех военнообязанных сотрудников направляет их в ОВУС, ГЗ и ЧС для последующей регистрации и постановки на воинский учет;\"}]}, {\"type\": \"paragraph\", \"level\": 4, \"children\": [{\"text\": \"студенты-призывники при поступлении в АО «АТУ» на учебу, обязаны встать на воинский учет. Постановка студента призывника осуществляется на основании приказа ректора АО «АТУ» о приеме на обучение (копия приказа в ОВУС, ГЗ и ЧС поступает через ОР);\"}]}, {\"type\": \"paragraph\", \"level\": 4, \"children\": [{\"text\": \"на штатных студентов в ОВУС, ГЗ и ЧС оформляются личные карточки по формам Ф.АХВ-7.1.3-2023-01-06 на государственном и русском языках Ф.АХВ-7.1.3-2023-01-07\"}]}, {\"type\": \"paragraph\", \"level\": 4, \"children\": [{\"text\": \"на каждого студента-призывника в ОВУС, ГЗ и ЧС оформляется справка по форме Ф.АХВ-7.1.3-2023-01-08 на государственном и русском языках Ф.АХВ-7.1.3-2023-01-09, с регистрацией в журнале регистрации и выдачи справок по форме Ф.АХВ-7.1.3-2023-01-10. Полученную справку призывник обязан представить в управления (отделы) по делам обороны;\"}]}, {\"type\": \"paragraph\", \"level\": 4, \"children\": [{\"text\": \"на основании ежегодных приказов по АО «АТУ» об окончании и переводе студентов на последующие курсы, копии приказов представляет ОР/УПО, призывникам вторых и последующих курсов выписываются справки Ф.АХВ-7.1.3-2023-01-08, Ф.АХВ-7.1.3-2023-01-09 и отправляются почтой в управления (отделы) по делам обороны, а студентам первых курсов и магистрантам при постановке на воинский учет выдаются лично в руки;\"}]}, {\"type\": \"paragraph\", \"level\": 4, \"children\": [{\"text\": \"ежегодно ответственное лицо ОВУС, ГЗ и ЧС обязано представлять в управления (отделы) по делам обороны сведения о численности работающих (учащихся) военнообязанных и призывников по форме (форму получает в УДО) .\"}]}, {\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"На ОВУС, ГЗ и ЧС возложен учет печатей и штампов АО «АТУ», сведением книги учета по форме Ф.АХВ-7.1.3-2023-01-11.\"}]}]', 0, 8, '2026-01-02 01:07:39', '2026-01-25 09:11:02'),
(9, 1, 'Ответственность и полномочия', '[{\"type\": \"paragraph\", \"children\": [{\"text\": \"\"}]}, {\"type\": \"table\", \"children\": [{\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Подразделение\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Ответственность/Полномочия\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Ректор\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"• утверждение настоящей ДП и новых версий в случае возникновения изменений;\"}]}, {\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"• применение ДП;\"}]}, {\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"• утверждение Плана мероприятий по ТБ, ПБ и ПР.\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Первый\"}]}, {\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"проректор\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"• согласование настоящей ДП;\"}]}, {\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"• анализ функционирования процесса;\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Проректор по\"}]}, {\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"АХВ\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"• разработку и внедрение ДП;\"}]}, {\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"• управление процессом АТУ-АХВ-ИКП-7.1.4-2023-29 «Обеспечение безопасности жизнедеятельности»;\"}]}, {\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"• организацию работ по ТБ, ПБ и ОТ;\"}]}, {\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"• подготовку самоотчета по процессу.\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"ОУП\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"• контроль за постановкой на воинский учет и прохождением инструктажа по технике безопасности и пожарной безопасности вновь поступающих сотрудников\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"ОР\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"• своевременное обеспечение информацией о перемещении студентов (копии приказов о зачислении, переводе, отчислении).\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Руководители СП\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"• обеспечить прибытие студентов первого курса для постановки на воинский учет;\"}]}, {\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"• представлять штатные формуляры к установленным срокам;\"}]}, {\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"• проводить инструктажи сотрудников на рабочем месте, записью в журнале;\"}]}, {\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"• информировать персонал о времени и месте проведении учений по ГЗ и ЧС.\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Все сотрудники\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"• соблюдать меры ТБ, ПБ и ОТ.\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"ОВУС, ГЗ и ЧС\", \"italic\": true}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"• организацию разработки ДП и ввод в действие настоящей ДП;\"}]}, {\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"• анализ деятельности и результатов процесса.\"}]}]}]}]}]', 0, 9, '2026-01-02 04:26:15', '2026-01-25 09:11:02'),
(10, 1, 'Риски, связанные с процессом', '[{\"type\": \"paragraph\", \"children\": [{\"text\": \"\"}]}, {\"type\": \"table\", \"children\": [{\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Риски, связанные с процессом:\", \"italic\": true}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"Действия по предупреждению рисков:\", \"italic\": true}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"Риск травматизма работников при осуществлении деятельности и обучающихся:\\nотсутствие проведения инструктажа по технике и пожарной безопасности на рабочих местах;\\nвыход из строя системы оповещения, неисполнение сигналов оповещения о стихийных бедствиях соблюдение пожарной безопасности и мер техники безопасности на учебных местах практического обучения;\\nнесвоевременная постановка на воинский учет;\\nРиск захламленности рабочих мест и территории мусором, снегом, льдом;\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"своевременное проведение инструктажей с обучающимися и сотрудникам при поступлении на работу и на рабочих местах с пометкой в журнала (Журнал регистрации вводных инструктажей по Технике Безопасности;\\nЖурнал регистрации инструктажей по Технике Безопасности на рабочем месте; Журнал регистрации вводных инструктажей по Пожарной Безопасности;\\nЖурнал проведения инструктажей о соблюдении мер Пожарной Безопасности; своевременная поверка и тренировка по действиям сигналов оповещения, постоянное обучение руководителей команд спасения на курсах;\\nсвоевременная уборка территории от мусора, снега, льда;\\nпостоянный контроль за пожарной безопасностью на объектах АО «АТУ»;\"}]}, {\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"содержание в исправном состоянии первичных средств тушения пожара и своевременная перезарядка огнетушителей;\"}]}, {\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"проведение информационно- разъяснительной работы деканатов с обучающимися.\"}]}]}]}]}]', 0, 10, '2026-01-02 04:32:54', '2026-01-25 09:11:02'),
(11, 1, 'Конфиденциальность', '[{\"type\": \"paragraph\", \"children\": [{\"text\": \"Настоящая ДП является внутренним нормативным документом АО «АТУ» и не подлежит представлению другим сторонам, кроме проверяющих органов по разрешению ректора АО «АТУ».\"}]}]', 0, 11, '2026-01-02 04:40:22', '2026-01-25 09:11:02'),
(12, 1, 'Заключительные положения', '[{\"type\": \"paragraph\", \"children\": [{\"text\": \"Итоги работы ОВУС, ГЗ и ЧС по воинскому учету военнообязанных и выполнению требований по ГЗ и ЧС, а также обеспечение ТБ и ПБ подводятся в конце года, и информируется руководство АО «АТУ»\"}]}, {\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"Вопросы, не регламентированные настоящим ДП, регулируются в соответствии с действующим законодательством РК и нормативным документом АО «АТУ» .\"}]}]', 0, 12, '2026-01-02 04:40:23', '2026-01-25 09:11:03');
INSERT INTO `chapters` (`id`, `document_id`, `title`, `content`, `open`, `position`, `created_at`, `updated_at`) VALUES
(13, 1, '13 Глава', '[{\"type\": \"paragraph\", \"children\": [{\"bold\": true, \"text\": \"ghbdtn\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"1231212\", \"italic\": true}]}, {\"type\": \"paragraph\", \"level\": 4, \"children\": [{\"text\": \"123465465\"}]}, {\"type\": \"paragraph\", \"level\": 4, \"children\": [{\"text\": \"\"}, {\"type\": \"math\", \"latex\": \"x^2 + y^2 = z^2\", \"children\": [{\"text\": \"\"}]}, {\"text\": \"\"}, {\"type\": \"math\", \"latex\": \"\\\\alpha \\\\beta \\\\gamma \\\\to \\\\infty\", \"children\": [{\"text\": \"\"}]}, {\"text\": \"\"}]}, {\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"\"}]}, {\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"sdfsdf\", \"underline\": true}]}, {\"type\": \"table\", \"children\": [{\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"sdfsdf\", \"italic\": true}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"sdfsdf\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"bold\": true, \"text\": \"sdfsdfsd\", \"underline\": true}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"sdfsdfsdf\"}]}]}]}]}]', 0, 13, '2026-01-06 01:47:14', '2026-01-25 09:11:03'),
(14, 2, '1 Глава', '[{\"type\": \"paragraph\", \"children\": [{\"text\": \"11\"}]}, {\"type\": \"paragraph\", \"level\": 3, \"children\": [{\"text\": \"111ва\"}]}, {\"type\": \"paragraph\", \"level\": 4, \"children\": [{\"text\": \"111\"}]}, {\"type\": \"paragraph\", \"level\": 4, \"children\": [{\"text\": \"4564564\"}, {\"id\": \"96c7bdb6-3922-41d0-ab21-0600c28699fe\", \"url\": \"data:image/png;base64,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\", \"type\": \"inline-image\", \"width\": 154, \"height\": 168, \"children\": [{\"text\": \"\"}], \"rotation\": 0}, {\"text\": \"1231 12132123123 22222222222222222222222222222222 22222222222222222222222222222222222222222 222222222222222222222222\"}]}, {\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"12\"}]}, {\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"13\"}]}, {\"type\": \"table\", \"children\": [{\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"12\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"23\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"34\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"45\"}]}]}]}]}]', 0, 1, '2026-01-06 08:37:13', '2026-01-09 03:52:50'),
(15, 2, '2 Глава', '[{\"type\": \"paragraph\", \"children\": [{\"text\": \"9999999999999999 123 123 123 фывфывфы фывфыв фывфывфыв фывфвф фывфывфы фывфывфыв фывфывфывф фывф ыв фывфывфыв фывыфвф вфыв ываыв ыфвфывфы фывфывфыв ыфвфывыва ываываы ываываыв ываываыв ываываыв sdfsdfsыв ываываыв ываываыв ываываываы ываываыва \\nываываыва\\nываываы\\nываыва\\n\\n\\n 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 123 45\\n645\"}, {\"id\": \"dfbc2337-e807-4394-8da6-5305e8870732\", \"url\": \"data:image/png;base64,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\", \"type\": \"inline-image\", \"width\": 108, \"height\": 81, \"children\": [{\"text\": \"\"}], \"rotation\": 0}, {\"text\": \"ываыва\"}, {\"id\": \"24743c7c-a290-4d36-be36-f41d84a9fdf9\", \"url\": \"data:image/png;base64,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\", \"type\": \"inline-image\", \"width\": 196, \"height\": 94, \"children\": [{\"text\": \"\"}], \"rotation\": 0}, {\"text\": \"4\\n5\\n6\"}]}, {\"type\": \"table\", \"children\": [{\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"12\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"45\"}]}]}]}, {\"type\": \"table-row\", \"children\": [{\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"78\"}]}]}, {\"type\": \"table-cell\", \"children\": [{\"type\": \"paragraph\", \"level\": 0, \"children\": [{\"text\": \"45\"}]}]}]}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"\"}]}, {\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"\"}]}, {\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"\"}]}, {\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"\"}]}, {\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"\"}]}, {\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"\"}]}, {\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"\"}]}, {\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"\"}]}, {\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"\"}]}, {\"type\": \"paragraph\", \"level\": 2, \"children\": [{\"text\": \"\"}]}]', 0, 2, '2026-01-07 23:59:34', '2026-01-09 03:52:51');

-- --------------------------------------------------------

--
-- Структура таблицы `chapter_checks`
--

CREATE TABLE `chapter_checks` (
  `id` bigint UNSIGNED NOT NULL,
  `chapter_id` bigint UNSIGNED NOT NULL,
  `status` enum('checking','ok','error') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'checking',
  `result` json DEFAULT NULL,
  `model` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'gpt-4o-mini',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `chapter_checks`
--

INSERT INTO `chapter_checks` (`id`, `chapter_id`, `status`, `result`, `model`, `created_at`, `updated_at`) VALUES
(1, 1, 'error', '{\"ok\": false, \"errors\": [{\"type\": \"spelling\", \"message\": \"Найдено слово с ошибкой\", \"fragment\": \"програмирование\"}], \"summary\": \"Найдены орфографические ошибки\"}', 'gpt-4o-mini', '2026-01-23 08:31:03', '2026-01-23 08:31:03'),
(2, 1, 'ok', '{\"ok\": true, \"errors\": [], \"summary\": \"Текст главы не содержит ошибок орфографии, грамматики или стиля. Ссылки не обнаружены.\"}', 'gpt-4o-mini', '2026-01-23 08:44:49', '2026-01-23 08:44:53'),
(3, 4, 'error', '{\"ok\": false, \"errors\": [{\"type\": \"reference\", \"message\": \"Некорректное оформление ссылки на международный стандарт ISO 27001:2022.\", \"fragment\": \"ISO 27001:2022 « Информационная безопасность, кибербезопасность и защита персональных данных – Системы менеджмента информационной безопасности – Требования».\"}, {\"type\": \"reference\", \"message\": \"Отсутствует указание на редакцию закона РК «Об образовании».\", \"fragment\": \"Закон РК «Об образовании» No 319-III от 27.07.2007 (с изменениями и дополнениями по состоянию на 10.09.2023 г.)\"}, {\"type\": \"reference\", \"message\": \"Некорректное оформление ссылки на приказ Министра обороны РК.\", \"fragment\": \"Приказ Министра обороны РК от 24 января 2017 года No28 «Об утверждении Правил воинского учета военнообязанных и призывников».\"}, {\"type\": \"reference\", \"message\": \"Некорректное оформление ссылки на технический регламент.\", \"fragment\": \"Технический Регламент «Общие требования к Пожарной Безопасности» No 439 от 23.06. 2017 г.\"}, {\"type\": \"reference\", \"message\": \"Некорректное оформление ссылки на приказ МЗ и СР РК.\", \"fragment\": \"Правила проведения обучения, инструктирования и проверок знаний работников по вопросам безопасности и охраны труда. (Приказ МЗ и СР РК от 25.12. 2015 г. No 1019).\"}], \"summary\": \"В тексте главы обнаружены ошибки в оформлении ссылок на международные стандарты, законы и подзаконные акты. Рекомендуется провести ручную проверку актуальности и редакции документов.\"}', 'gpt-4o-mini', '2026-01-23 09:22:06', '2026-01-23 09:22:16'),
(4, 1, 'error', '{\"ok\": false, \"errors\": [{\"type\": \"reference\", \"message\": \"Некорректное оформление ссылки на внутренний нормативный документ. Необходимо указать полное название документа и его статус.\", \"fragment\": \"Документированная процедура «Обеспечение безопасности жизнедеятельности» АТУ-АХВ-ДП-7.1.3.-2023-01.\"}], \"summary\": \"Обнаружена ошибка в оформлении ссылки на внутренний нормативный документ. Рекомендуется уточнить полное название и статус документа.\"}', 'gpt-4o-mini', '2026-01-23 09:26:56', '2026-01-23 09:27:01'),
(5, 2, 'error', '{\"ok\": false, \"errors\": [{\"type\": \"style\", \"message\": \"Необходимо использовать более формулировки, соответствующие научно-деловому стилю.\", \"fragment\": \"Проректор по Административно-хозяйственной части.\"}, {\"type\": \"style\", \"message\": \"Следует уточнить название отдела для большей ясности.\", \"fragment\": \"Отдел военно-учетного стола, гражданской защиты и чрезвычайных ситуаций.\"}], \"summary\": \"Текст требует доработки для соответствия научно-деловому стилю и ясности формулировок.\"}', 'gpt-4o-mini', '2026-01-23 09:28:01', '2026-01-23 09:28:05'),
(6, 3, 'error', '{\"ok\": false, \"errors\": [{\"type\": \"style\", \"message\": \"Слишком длинное и сложное предложение, требующее разбивки на более короткие.\", \"fragment\": \"Настоящая документированная процедура устанавливает требования по обеспечению безопасности жизнедеятельности, а также порядок реализации мероприятий, направленных на сохранение жизни и здоровья обучающихся и работающих при нормальном режиме работы и в чрезвычайных ситуациях и включает охрану труда, пожарную безопасность, защиту от чрезвычайных ситуаций природного и техногенного характера и гражданскую оборону.\"}], \"summary\": \"Обнаружена проблема со стилем из-за слишком длинного предложения. Рекомендуется разбить его на более короткие для улучшения читаемости.\"}', 'gpt-4o-mini', '2026-01-23 09:28:05', '2026-01-23 09:28:09'),
(7, 4, 'error', '{\"ok\": false, \"errors\": [{\"type\": \"reference\", \"message\": \"Некорректное оформление ссылки на международный стандарт ISO 27001.\", \"fragment\": \"ISO 27001:2022 « Информационная безопасность, кибербезопасность и защита персональных данных – Системы менеджмента информационной безопасности – Требования».\"}, {\"type\": \"reference\", \"message\": \"Отсутствует указание на редакцию закона РК «Об образовании».\", \"fragment\": \"Закон РК «Об образовании» No 319-III от 27.07.2007 (с изменениями и дополнениями по состоянию на 10.09.2023 г.)\"}, {\"type\": \"reference\", \"message\": \"Некорректное оформление ссылки на приказ Министра обороны РК.\", \"fragment\": \"Приказ Министра обороны РК от 24 января 2017 года No28 «Об утверждении Правил воинского учета военнообязанных и призывников».\"}, {\"type\": \"reference\", \"message\": \"Некорректное оформление ссылки на технический регламент.\", \"fragment\": \"Технический Регламент «Общие требования к Пожарной Безопасности» No 439 от 23.06. 2017 г.\"}, {\"type\": \"reference\", \"message\": \"Некорректное оформление ссылки на приказ МЗ и СР РК.\", \"fragment\": \"Правила проведения обучения, инструктирования и проверок знаний работников по вопросам безопасности и охраны труда. (Приказ МЗ и СР РК от 25.12. 2015 г. No 1019).\"}], \"summary\": \"В тексте главы обнаружены ошибки в оформлении ссылок на международные стандарты, законы и подзаконные акты. Рекомендуется проверить актуальность и редакцию документов, а также исправить оформление ссылок.\"}', 'gpt-4o-mini', '2026-01-23 09:28:10', '2026-01-23 09:28:19'),
(8, 5, 'error', '{\"ok\": false, \"errors\": [{\"type\": \"spelling\", \"message\": \"Неправильное написание слова \'нормативный\'.\", \"fragment\": \"нормативные и справочные источники\"}, {\"type\": \"grammar\", \"message\": \"Неправильное согласование подлежащего и сказуемого.\", \"fragment\": \"документы организаций требует ручной проверки\"}, {\"type\": \"style\", \"message\": \"Отсутствие научно-делового стиля в формулировках.\", \"fragment\": \"Важно отметить, что это требует ручной проверки.\"}, {\"type\": \"reference\", \"message\": \"Некорректное оформление ссылки на международный стандарт ISO.\", \"fragment\": \"Согласно ISO 9001:2015\"}], \"summary\": \"В тексте главы обнаружены ошибки в орфографии, грамматике, стиле и оформлении ссылок. Рекомендуется провести корректировку.\"}', 'gpt-4o-mini', '2026-01-23 09:28:20', '2026-01-23 09:28:25');

-- --------------------------------------------------------

--
-- Структура таблицы `chats`
--

CREATE TABLE `chats` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `documents`
--

CREATE TABLE `documents` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Новый документ',
  `json_code` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `cover` json DEFAULT NULL,
  `preface` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `documents`
--

INSERT INTO `documents` (`id`, `uuid`, `title`, `json_code`, `created_at`, `updated_at`, `cover`, `preface`) VALUES
(1, 'efc9130e-a573-44c9-b334-220ea0bf058c', 'ОБЖ ОВУС, ГЗиЧС', '{\"chapters\": []}', '2025-12-26 09:00:18', '2026-01-09 05:30:06', '{\"iso\": \"МС ISO 9000:2015, МС ISO 9001:2015, МС ISO 37001:2016, МС ISO 27001:2022\", \"city\": \"Алматы\", \"code\": \"АТУ-ДСР-ДП-7.5-2026-02\", \"year\": 2026, \"system\": \"СИСТЕМА МЕНЕДЖМЕНТА КАЧЕСТВА\", \"organization\": \"АО «Алматинский технологический университет»\", \"document_name\": \"ДОКУМЕНТИРОВАННАЯ ИНФОРМАЦИЯ\", \"document_type\": \"Документированная процедура\"}', '[{\"type\": \"paragraph\", \"children\": [{\"text\": \"Настоящая ДП разработана Департаментом стратегического развития АТУ.\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"Настоящая ДП утверждается Ректором личной подписью на титульном листе.\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"Настоящая ДП является обязательной для всех СП АТУ в части их деятельности, связанной с СМК.\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"Периодическая проверка настоящей ДП производится начальником ОСМК с интервалом, не превышающим 3 года.\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"Изменения в настоящую ДП разрабатываются по результатам её применения или при изменении требований, указанных в пункте 4.\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"Ответственность за организацию и координацию деятельности по выполнению конкретных этапов процесса управления документацией несёт начальник ОСМК.\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"Считать утратившими силу ДП «Документированная информация» АТУ-УКиА-ДП-7.5-2020-02, версия 05, утвержденную 04.01.2023г.\"}]}]'),
(2, '195057b2-e5a2-4996-84fa-1c8669bafe35', 'Документ 21231123123', '{\"chapters\": []}', '2025-12-26 09:01:23', '2026-01-09 00:49:28', NULL, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `messages`
--

CREATE TABLE `messages` (
  `id` bigint UNSIGNED NOT NULL,
  `chat_id` bigint UNSIGNED NOT NULL,
  `role` enum('user','assistant') COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_10_17_050319_create_roles_table', 1),
(5, '2025_10_17_050448_create_role_user_table', 1),
(6, '2025_11_20_112029_create_telescope_entries_table', 1),
(7, '2025_11_20_112352_create_personal_access_tokens_table', 1),
(8, '2025_11_20_144927_create_chats_table', 1),
(9, '2025_11_20_144932_create_messages_table', 1),
(10, '2025_11_25_060125_create_documents_table', 1),
(11, '2025_11_26_112038_create_ai_logs_table', 1),
(12, '2025_12_25_060125_create_chapters_table', 1),
(13, '2026_01_09_065703_add_cover_and_preface_to_documents', 2),
(14, '2026_01_23_130642_create_chapter_checks_table', 3);

-- --------------------------------------------------------

--
-- Структура таблицы `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `roles`
--

CREATE TABLE `roles` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `roles`
--

INSERT INTO `roles` (`id`, `name`, `label`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'Админ', NULL, NULL),
(2, 'user', 'Пользователь', NULL, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `role_user`
--

CREATE TABLE `role_user` (
  `user_id` bigint UNSIGNED NOT NULL,
  `role_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `role_user`
--

INSERT INTO `role_user` (`user_id`, `role_id`) VALUES
(1, 1),
(2, 2);

-- --------------------------------------------------------

--
-- Структура таблицы `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('qzdwii7Ax3IaVQivJf3jERNGhiev8EbDy14AvzRX', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiOWVET3A5TjB5NzU5dms0dUhqV1ViZTM3cFZRQzBKVjQyVDg2V3dXWiI7czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czo3NDoiaHR0cDovLzEyNy4wLjAuMTo4MDAwL2FkbWluL2RvY3VtZW50cy80ZDA2YzdkNy1kMzIxLTRlMGMtYmRjMi0wNjM4YjA4MjJiNWIiO31zOjk6Il9wcmV2aW91cyI7YToyOntzOjM6InVybCI7czoyNzoiaHR0cDovLzEyNy4wLjAuMTo4MDAwL2xvZ2luIjtzOjU6InJvdXRlIjtzOjU6ImxvZ2luIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1769364167),
('SuquNH1et2QCTET73sAppZQt1zq71rEPhOcZHO7j', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoidTBaTjA2S2FSMG80RjUxcUpIVVpmWjJGcFBuQjFHbHJaN0plVmtIRiI7czozOiJ1cmwiO2E6MDp7fXM6OToiX3ByZXZpb3VzIjthOjI6e3M6MzoidXJsIjtzOjc0OiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYWRtaW4vZG9jdW1lbnRzLzRkMDZjN2Q3LWQzMjEtNGUwYy1iZGMyLTA2MzhiMDgyMmI1YiI7czo1OiJyb3V0ZSI7czoxNDoiZG9jdW1lbnRzLmVkaXQiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxO30=', 1769350270);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin User', 'admin@teach.ai.atu.kz', NULL, '$2y$12$GMatNGqHN831qDSmmFngo.xYIjTqGW1ePQoDhBBrMznpDsPsqKrbK', NULL, '2025-12-26 08:55:30', '2025-12-26 08:55:30'),
(2, 'User User', 'user@teach.ai.atu.kz', NULL, '$2y$12$5LA5spRUF72ltaFvpdJy5uKP6XDhOSDd5/aIKEctE.BS8rkS0gg4q', NULL, '2025-12-26 08:55:30', '2025-12-26 08:55:30');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `ai_logs`
--
ALTER TABLE `ai_logs`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Индексы таблицы `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Индексы таблицы `chapters`
--
ALTER TABLE `chapters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chapters_document_id_foreign` (`document_id`);

--
-- Индексы таблицы `chapter_checks`
--
ALTER TABLE `chapter_checks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chapter_checks_chapter_id_foreign` (`chapter_id`);

--
-- Индексы таблицы `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chats_user_id_foreign` (`user_id`);

--
-- Индексы таблицы `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `documents_uuid_unique` (`uuid`);

--
-- Индексы таблицы `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Индексы таблицы `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Индексы таблицы `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `messages_chat_id_foreign` (`chat_id`);

--
-- Индексы таблицы `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Индексы таблицы `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Индексы таблицы `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_unique` (`name`),
  ADD UNIQUE KEY `roles_label_unique` (`label`);

--
-- Индексы таблицы `role_user`
--
ALTER TABLE `role_user`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `role_user_role_id_foreign` (`role_id`);

--
-- Индексы таблицы `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `ai_logs`
--
ALTER TABLE `ai_logs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `chapters`
--
ALTER TABLE `chapters`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT для таблицы `chapter_checks`
--
ALTER TABLE `chapter_checks`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT для таблицы `chats`
--
ALTER TABLE `chats`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `documents`
--
ALTER TABLE `documents`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT для таблицы `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `chapters`
--
ALTER TABLE `chapters`
  ADD CONSTRAINT `chapters_document_id_foreign` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `chapter_checks`
--
ALTER TABLE `chapter_checks`
  ADD CONSTRAINT `chapter_checks_chapter_id_foreign` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `chats`
--
ALTER TABLE `chats`
  ADD CONSTRAINT `chats_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_chat_id_foreign` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `role_user`
--
ALTER TABLE `role_user`
  ADD CONSTRAINT `role_user_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
