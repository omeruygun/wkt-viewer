/**
 * Internationalization (i18n) Module
 * Supported languages: tr, en, de, ru
 */

const translations = {
    tr: {
        // Header
        "app.title": "Online WKT Viewer",
        
        // Sidebar
        "sidebar.geometries": "Geometriler",
        "sidebar.addWkt": "WKT Ekle",
        "sidebar.excel": "Excel",
        "sidebar.export": "Dışa Aktar",
        
        // Geometry List
        "geometry.noData": "Henüz geometri eklenmedi",
        "geometry.zoom": "Yakınlaştır",
        "geometry.style": "Stil",
        "geometry.projection": "Projeksiyon",
        "geometry.delete": "Sil",
        
        // Map Toolbar
        "toolbar.drawPoint": "Nokta Çiz",
        "toolbar.drawLine": "Çizgi Çiz",
        "toolbar.drawPolygon": "Alan Çiz",
        "toolbar.stopDrawing": "Çizimi Durdur",
        "toolbar.clearAll": "Tümünü Temizle",
        
        // Basemap
        "basemap.title": "Altlık Katman",
        "basemap.osm": "OpenStreetMap",
        "basemap.satellite": "Google Uydu",
        "basemap.hybrid": "Hibrit",
        
        // WKT Modal
        "wktModal.title": "WKT String Ekle",
        "wktModal.wktString": "WKT String",
        "wktModal.wktPlaceholder": "Örnek: POINT(100 50)",
        "wktModal.sourceProjection": "Kaynak Projeksiyon (WKT'nin Projeksiyonu)",
        "wktModal.note": "Geometri otomatik olarak haritanın projeksiyonuna (EPSG:3857) dönüştürülecektir.",
        "wktModal.geometryName": "Geometri Adı (İsteğe Bağlı)",
        "wktModal.namePlaceholder": "Örnek: Şehir Merkezi",
        
        // Style Modal
        "styleModal.title": "Stil Düzenle",
        "styleModal.titlePoint": "Nokta Stilini Düzenle",
        "styleModal.titleLine": "Çizgi Stilini Düzenle",
        "styleModal.titlePolygon": "Alan Stilini Düzenle",
        "styleModal.geometryName": "Geometri Adı",
        "styleModal.showLabel": "Haritada etiket göster",
        "styleModal.pointStyle": "Nokta Stili",
        "styleModal.lineStyle": "Çizgi Stili",
        "styleModal.polygonStyle": "Alan Stili",
        "styleModal.radius": "Yarıçap (px)",
        "styleModal.color": "Renk",
        "styleModal.strokeColor": "Çerçeve Rengi",
        "styleModal.strokeWidth": "Çerçeve Kalınlığı (px)",
        "styleModal.fillColor": "Dolgu Rengi",
        "styleModal.fillOpacity": "Dolgu Opaklığı (%)",
        "styleModal.width": "Kalınlık (px)",
        
        // Projection Modal
        "projModal.title": "Projeksiyon Bilgileri",
        "projModal.geometryName": "Geometri Adı",
        "projModal.projection": "Projeksiyon",
        "projModal.wkt": "WKT",
        "projModal.copy": "Kopyala",
        
        // Excel Modal
        "excelModal.title": "Excel'den İçe Aktar",
        "excelModal.selectFile": "Excel Dosyası Seçin (.xlsx, .xls)",
        "excelModal.dropzone": "Dosya seçmek için tıklayın veya sürükleyip bırakın",
        "excelModal.format": ".xlsx veya .xls formatında",
        "excelModal.rowsFound": "satır bulundu",
        "excelModal.differentFile": "Farklı Dosya",
        "excelModal.selectSheet": "Sayfa Seçin",
        "excelModal.wktColumn": "WKT Sütunu (Zorunlu)",
        "excelModal.selectColumn": "-- Sütun Seçin --",
        "excelModal.labelColumn": "Etiket/İsim Sütunu (İsteğe Bağlı)",
        "excelModal.noLabel": "-- Etiket Yok --",
        "excelModal.sourceProjection": "Kaynak Projeksiyon",
        "excelModal.geometryStyle": "Geometri Stili",
        "excelModal.showLabels": "Haritada etiketleri göster",
        "excelModal.preview": "Veri Önizleme (İlk 5 Satır)",
        "excelModal.import": "İçe Aktar",
        
        // Export Modal
        "exportModal.title": "Geometrileri Dışa Aktar",
        "exportModal.count": "geometri dışa aktarılacak",
        "exportModal.targetProjection": "Hedef Projeksiyon",
        "exportModal.format": "Export Formatı",
        "exportModal.csv": "CSV",
        "exportModal.csvDesc": "Excel uyumlu",
        "exportModal.json": "JSON",
        "exportModal.jsonDesc": "Geliştirici dostu",
        "exportModal.geojson": "GeoJSON",
        "exportModal.geojsonDesc": "GIS standart",
        "exportModal.includeStyles": "Stil bilgilerini dahil et",
        "exportModal.export": "Dışa Aktar",
        
        // Buttons
        "btn.cancel": "İptal",
        "btn.add": "Ekle",
        "btn.apply": "Uygula",
        "btn.close": "Kapat",
        
        // Status Messages
        "status.drawingActive": "çizim modu aktif",
        "status.drawingStopped": "Çizim durduruldu",
        "status.geometryAdded": "başarıyla eklendi",
        "status.geometryDeleted": "Geometri silindi",
        "status.allCleared": "Tüm geometriler silindi",
        "status.styleApplied": "Stil uygulandı",
        "status.zoomedTo": "Geometriye yakınlaştırıldı",
        "status.copied": "Panoya kopyalandı",
        "status.copyFailed": "Kopyalama başarısız",
        "status.exported": "geometri başarıyla dışa aktarıldı",
        "status.imported": "geometri içe aktarıldı",
        "status.noGeometries": "Dışa aktarılacak geometri yok",
        "status.basemap": "Altlık",
        "status.wktError": "WKT parsing hatası",
        "status.enterWkt": "Lütfen WKT string girin",
        
        // Confirmations
        "confirm.title": "Onay",
        "confirm.delete": "Bu geometriyi silmek istediğinizden emin misiniz?",
        "confirm.clearAll": "Tüm geometrileri silmek istediğinizden emin misiniz?",
        "btn.confirm": "Onayla",
        
        // Geometry Types
        "geomType.Point": "Nokta",
        "geomType.LineString": "Çizgi",
        "geomType.Polygon": "Alan",
        "geomType.MultiPoint": "Çoklu Nokta",
        "geomType.MultiLineString": "Çoklu Çizgi",
        "geomType.MultiPolygon": "Çoklu Alan",
        
        // Language
        "lang.select": "Dil",
        "lang.tr": "Türkçe",
        "lang.en": "English",
        "lang.de": "Deutsch",
        "lang.ru": "Русский",
        
        // SEO
        "seo.description": "Online WKT Viewer - WKT formatındaki geometrik verileri harita üzerinde görselleştirin. Nokta, çizgi, polygon çizimi ve projeksiyon dönüşümleri.",
        "seo.keywords": "WKT, Well-Known Text, harita, map, geometry, geometri, OpenLayers, projeksiyon, EPSG, koordinat, GIS, CBS",
        "seo.ogDescription": "WKT formatındaki geometrik verileri harita üzerinde görselleştirin. Ücretsiz online araç.",
        "seo.aiDeclaration": "Bu web sitesi, WKT (Well-Known Text) geometrik verilerini interaktif haritalarda görselleştirmek için bir araç sağlar.",
        "seo.jsonDescription": "WKT (Well-Known Text) formatındaki geometrik verileri harita üzerinde görselleştirmek için ücretsiz online araç. Nokta, çizgi, polygon çizimi ve projeksiyon dönüşümleri desteklenir."
    },
    
    en: {
        // Header
        "app.title": "Online WKT Viewer",
        
        // Sidebar
        "sidebar.geometries": "Geometries",
        "sidebar.addWkt": "Add WKT",
        "sidebar.excel": "Excel",
        "sidebar.export": "Export",
        
        // Geometry List
        "geometry.noData": "No geometries added yet",
        "geometry.zoom": "Zoom to",
        "geometry.style": "Style",
        "geometry.projection": "Projection",
        "geometry.delete": "Delete",
        
        // Map Toolbar
        "toolbar.drawPoint": "Draw Point",
        "toolbar.drawLine": "Draw Line",
        "toolbar.drawPolygon": "Draw Polygon",
        "toolbar.stopDrawing": "Stop Drawing",
        "toolbar.clearAll": "Clear All",
        
        // Basemap
        "basemap.title": "Base Layer",
        "basemap.osm": "OpenStreetMap",
        "basemap.satellite": "Google Satellite",
        "basemap.hybrid": "Hybrid",
        
        // WKT Modal
        "wktModal.title": "Add WKT String",
        "wktModal.wktString": "WKT String",
        "wktModal.wktPlaceholder": "Example: POINT(100 50)",
        "wktModal.sourceProjection": "Source Projection (WKT's Projection)",
        "wktModal.note": "Geometry will be automatically transformed to map projection (EPSG:3857).",
        "wktModal.geometryName": "Geometry Name (Optional)",
        "wktModal.namePlaceholder": "Example: City Center",
        
        // Style Modal
        "styleModal.title": "Edit Style",
        "styleModal.titlePoint": "Edit Point Style",
        "styleModal.titleLine": "Edit Line Style",
        "styleModal.titlePolygon": "Edit Polygon Style",
        "styleModal.geometryName": "Geometry Name",
        "styleModal.showLabel": "Show label on map",
        "styleModal.pointStyle": "Point Style",
        "styleModal.lineStyle": "Line Style",
        "styleModal.polygonStyle": "Polygon Style",
        "styleModal.radius": "Radius (px)",
        "styleModal.color": "Color",
        "styleModal.strokeColor": "Stroke Color",
        "styleModal.strokeWidth": "Stroke Width (px)",
        "styleModal.fillColor": "Fill Color",
        "styleModal.fillOpacity": "Fill Opacity (%)",
        "styleModal.width": "Width (px)",
        
        // Projection Modal
        "projModal.title": "Projection Information",
        "projModal.geometryName": "Geometry Name",
        "projModal.projection": "Projection",
        "projModal.wkt": "WKT",
        "projModal.copy": "Copy",
        
        // Excel Modal
        "excelModal.title": "Import from Excel",
        "excelModal.selectFile": "Select Excel File (.xlsx, .xls)",
        "excelModal.dropzone": "Click to select or drag and drop",
        "excelModal.format": "in .xlsx or .xls format",
        "excelModal.rowsFound": "rows found",
        "excelModal.differentFile": "Different File",
        "excelModal.selectSheet": "Select Sheet",
        "excelModal.wktColumn": "WKT Column (Required)",
        "excelModal.selectColumn": "-- Select Column --",
        "excelModal.labelColumn": "Label/Name Column (Optional)",
        "excelModal.noLabel": "-- No Label --",
        "excelModal.sourceProjection": "Source Projection",
        "excelModal.geometryStyle": "Geometry Style",
        "excelModal.showLabels": "Show labels on map",
        "excelModal.preview": "Data Preview (First 5 Rows)",
        "excelModal.import": "Import",
        
        // Export Modal
        "exportModal.title": "Export Geometries",
        "exportModal.count": "geometries to export",
        "exportModal.targetProjection": "Target Projection",
        "exportModal.format": "Export Format",
        "exportModal.csv": "CSV",
        "exportModal.csvDesc": "Excel compatible",
        "exportModal.json": "JSON",
        "exportModal.jsonDesc": "Developer friendly",
        "exportModal.geojson": "GeoJSON",
        "exportModal.geojsonDesc": "GIS standard",
        "exportModal.includeStyles": "Include style information",
        "exportModal.export": "Export",
        
        // Buttons
        "btn.cancel": "Cancel",
        "btn.add": "Add",
        "btn.apply": "Apply",
        "btn.close": "Close",
        
        // Status Messages
        "status.drawingActive": "drawing mode active",
        "status.drawingStopped": "Drawing stopped",
        "status.geometryAdded": "added successfully",
        "status.geometryDeleted": "Geometry deleted",
        "status.allCleared": "All geometries cleared",
        "status.styleApplied": "Style applied",
        "status.zoomedTo": "Zoomed to geometry",
        "status.copied": "Copied to clipboard",
        "status.copyFailed": "Copy failed",
        "status.exported": "geometries exported successfully",
        "status.imported": "geometries imported",
        "status.noGeometries": "No geometries to export",
        "status.basemap": "Basemap",
        "status.wktError": "WKT parsing error",
        "status.enterWkt": "Please enter WKT string",
        
        // Confirmations
        "confirm.title": "Confirm",
        "confirm.delete": "Are you sure you want to delete this geometry?",
        "confirm.clearAll": "Are you sure you want to delete all geometries?",
        "btn.confirm": "Confirm",
        
        // Geometry Types
        "geomType.Point": "Point",
        "geomType.LineString": "Line",
        "geomType.Polygon": "Polygon",
        "geomType.MultiPoint": "MultiPoint",
        "geomType.MultiLineString": "MultiLine",
        "geomType.MultiPolygon": "MultiPolygon",
        
        // Language
        "lang.select": "Language",
        "lang.tr": "Türkçe",
        "lang.en": "English",
        "lang.de": "Deutsch",
        "lang.ru": "Русский"
    },
    
    de: {
        // Header
        "app.title": "Online WKT Viewer",
        
        // Sidebar
        "sidebar.geometries": "Geometrien",
        "sidebar.addWkt": "WKT Hinzufügen",
        "sidebar.excel": "Excel",
        "sidebar.export": "Exportieren",
        
        // Geometry List
        "geometry.noData": "Noch keine Geometrien hinzugefügt",
        "geometry.zoom": "Zoomen",
        "geometry.style": "Stil",
        "geometry.projection": "Projektion",
        "geometry.delete": "Löschen",
        
        // Map Toolbar
        "toolbar.drawPoint": "Punkt zeichnen",
        "toolbar.drawLine": "Linie zeichnen",
        "toolbar.drawPolygon": "Polygon zeichnen",
        "toolbar.stopDrawing": "Zeichnen beenden",
        "toolbar.clearAll": "Alles löschen",
        
        // Basemap
        "basemap.title": "Basiskarte",
        "basemap.osm": "OpenStreetMap",
        "basemap.satellite": "Google Satellit",
        "basemap.hybrid": "Hybrid",
        
        // WKT Modal
        "wktModal.title": "WKT String hinzufügen",
        "wktModal.wktString": "WKT String",
        "wktModal.wktPlaceholder": "Beispiel: POINT(100 50)",
        "wktModal.sourceProjection": "Quellprojektion (WKT-Projektion)",
        "wktModal.note": "Die Geometrie wird automatisch in die Kartenprojektion (EPSG:3857) transformiert.",
        "wktModal.geometryName": "Geometriename (Optional)",
        "wktModal.namePlaceholder": "Beispiel: Stadtzentrum",
        
        // Style Modal
        "styleModal.title": "Stil bearbeiten",
        "styleModal.titlePoint": "Punktstil bearbeiten",
        "styleModal.titleLine": "Linienstil bearbeiten",
        "styleModal.titlePolygon": "Polygonstil bearbeiten",
        "styleModal.geometryName": "Geometriename",
        "styleModal.showLabel": "Beschriftung auf Karte anzeigen",
        "styleModal.pointStyle": "Punktstil",
        "styleModal.lineStyle": "Linienstil",
        "styleModal.polygonStyle": "Polygonstil",
        "styleModal.radius": "Radius (px)",
        "styleModal.color": "Farbe",
        "styleModal.strokeColor": "Randfarbe",
        "styleModal.strokeWidth": "Randbreite (px)",
        "styleModal.fillColor": "Füllfarbe",
        "styleModal.fillOpacity": "Fülldeckkraft (%)",
        "styleModal.width": "Breite (px)",
        
        // Projection Modal
        "projModal.title": "Projektionsinformationen",
        "projModal.geometryName": "Geometriename",
        "projModal.projection": "Projektion",
        "projModal.wkt": "WKT",
        "projModal.copy": "Kopieren",
        
        // Excel Modal
        "excelModal.title": "Aus Excel importieren",
        "excelModal.selectFile": "Excel-Datei auswählen (.xlsx, .xls)",
        "excelModal.dropzone": "Klicken zum Auswählen oder Drag & Drop",
        "excelModal.format": "im .xlsx oder .xls Format",
        "excelModal.rowsFound": "Zeilen gefunden",
        "excelModal.differentFile": "Andere Datei",
        "excelModal.selectSheet": "Blatt auswählen",
        "excelModal.wktColumn": "WKT-Spalte (Erforderlich)",
        "excelModal.selectColumn": "-- Spalte auswählen --",
        "excelModal.labelColumn": "Beschriftungsspalte (Optional)",
        "excelModal.noLabel": "-- Keine Beschriftung --",
        "excelModal.sourceProjection": "Quellprojektion",
        "excelModal.geometryStyle": "Geometriestil",
        "excelModal.showLabels": "Beschriftungen auf Karte anzeigen",
        "excelModal.preview": "Datenvorschau (Erste 5 Zeilen)",
        "excelModal.import": "Importieren",
        
        // Export Modal
        "exportModal.title": "Geometrien exportieren",
        "exportModal.count": "Geometrien zum Exportieren",
        "exportModal.targetProjection": "Zielprojektion",
        "exportModal.format": "Exportformat",
        "exportModal.csv": "CSV",
        "exportModal.csvDesc": "Excel-kompatibel",
        "exportModal.json": "JSON",
        "exportModal.jsonDesc": "Entwicklerfreundlich",
        "exportModal.geojson": "GeoJSON",
        "exportModal.geojsonDesc": "GIS-Standard",
        "exportModal.includeStyles": "Stilinformationen einschließen",
        "exportModal.export": "Exportieren",
        
        // Buttons
        "btn.cancel": "Abbrechen",
        "btn.add": "Hinzufügen",
        "btn.apply": "Anwenden",
        "btn.close": "Schließen",
        
        // Status Messages
        "status.drawingActive": "Zeichenmodus aktiv",
        "status.drawingStopped": "Zeichnen beendet",
        "status.geometryAdded": "erfolgreich hinzugefügt",
        "status.geometryDeleted": "Geometrie gelöscht",
        "status.allCleared": "Alle Geometrien gelöscht",
        "status.styleApplied": "Stil angewendet",
        "status.zoomedTo": "Zur Geometrie gezoomt",
        "status.copied": "In Zwischenablage kopiert",
        "status.copyFailed": "Kopieren fehlgeschlagen",
        "status.exported": "Geometrien erfolgreich exportiert",
        "status.imported": "Geometrien importiert",
        "status.noGeometries": "Keine Geometrien zum Exportieren",
        "status.basemap": "Basiskarte",
        "status.wktError": "WKT-Parsing-Fehler",
        "status.enterWkt": "Bitte WKT-String eingeben",
        
        // Confirmations
        "confirm.title": "Bestätigung",
        "confirm.delete": "Möchten Sie diese Geometrie wirklich löschen?",
        "confirm.clearAll": "Möchten Sie wirklich alle Geometrien löschen?",
        "btn.confirm": "Bestätigen",
        
        // Geometry Types
        "geomType.Point": "Punkt",
        "geomType.LineString": "Linie",
        "geomType.Polygon": "Polygon",
        "geomType.MultiPoint": "Multipunkt",
        "geomType.MultiLineString": "Multilinie",
        "geomType.MultiPolygon": "Multipolygon",
        
        // Language
        "lang.select": "Sprache",
        "lang.tr": "Türkçe",
        "lang.en": "English",
        "lang.de": "Deutsch",
        "lang.ru": "Русский"
    },
    
    ru: {
        // Header
        "app.title": "Online WKT Viewer",
        
        // Sidebar
        "sidebar.geometries": "Геометрии",
        "sidebar.addWkt": "Добавить WKT",
        "sidebar.excel": "Excel",
        "sidebar.export": "Экспорт",
        
        // Geometry List
        "geometry.noData": "Геометрии ещё не добавлены",
        "geometry.zoom": "Приблизить",
        "geometry.style": "Стиль",
        "geometry.projection": "Проекция",
        "geometry.delete": "Удалить",
        
        // Map Toolbar
        "toolbar.drawPoint": "Нарисовать точку",
        "toolbar.drawLine": "Нарисовать линию",
        "toolbar.drawPolygon": "Нарисовать полигон",
        "toolbar.stopDrawing": "Остановить рисование",
        "toolbar.clearAll": "Очистить всё",
        
        // Basemap
        "basemap.title": "Базовый слой",
        "basemap.osm": "OpenStreetMap",
        "basemap.satellite": "Google Спутник",
        "basemap.hybrid": "Гибрид",
        
        // WKT Modal
        "wktModal.title": "Добавить WKT строку",
        "wktModal.wktString": "WKT строка",
        "wktModal.wktPlaceholder": "Пример: POINT(100 50)",
        "wktModal.sourceProjection": "Исходная проекция (проекция WKT)",
        "wktModal.note": "Геометрия будет автоматически преобразована в проекцию карты (EPSG:3857).",
        "wktModal.geometryName": "Название геометрии (необязательно)",
        "wktModal.namePlaceholder": "Пример: Центр города",
        
        // Style Modal
        "styleModal.title": "Редактировать стиль",
        "styleModal.titlePoint": "Редактировать стиль точки",
        "styleModal.titleLine": "Редактировать стиль линии",
        "styleModal.titlePolygon": "Редактировать стиль полигона",
        "styleModal.geometryName": "Название геометрии",
        "styleModal.showLabel": "Показать метку на карте",
        "styleModal.pointStyle": "Стиль точки",
        "styleModal.lineStyle": "Стиль линии",
        "styleModal.polygonStyle": "Стиль полигона",
        "styleModal.radius": "Радиус (px)",
        "styleModal.color": "Цвет",
        "styleModal.strokeColor": "Цвет обводки",
        "styleModal.strokeWidth": "Толщина обводки (px)",
        "styleModal.fillColor": "Цвет заливки",
        "styleModal.fillOpacity": "Прозрачность заливки (%)",
        "styleModal.width": "Толщина (px)",
        
        // Projection Modal
        "projModal.title": "Информация о проекции",
        "projModal.geometryName": "Название геометрии",
        "projModal.projection": "Проекция",
        "projModal.wkt": "WKT",
        "projModal.copy": "Копировать",
        
        // Excel Modal
        "excelModal.title": "Импорт из Excel",
        "excelModal.selectFile": "Выберите файл Excel (.xlsx, .xls)",
        "excelModal.dropzone": "Нажмите для выбора или перетащите файл",
        "excelModal.format": "в формате .xlsx или .xls",
        "excelModal.rowsFound": "строк найдено",
        "excelModal.differentFile": "Другой файл",
        "excelModal.selectSheet": "Выберите лист",
        "excelModal.wktColumn": "Столбец WKT (обязательно)",
        "excelModal.selectColumn": "-- Выберите столбец --",
        "excelModal.labelColumn": "Столбец метки (необязательно)",
        "excelModal.noLabel": "-- Без метки --",
        "excelModal.sourceProjection": "Исходная проекция",
        "excelModal.geometryStyle": "Стиль геометрии",
        "excelModal.showLabels": "Показать метки на карте",
        "excelModal.preview": "Предпросмотр данных (первые 5 строк)",
        "excelModal.import": "Импортировать",
        
        // Export Modal
        "exportModal.title": "Экспорт геометрий",
        "exportModal.count": "геометрий для экспорта",
        "exportModal.targetProjection": "Целевая проекция",
        "exportModal.format": "Формат экспорта",
        "exportModal.csv": "CSV",
        "exportModal.csvDesc": "Совместим с Excel",
        "exportModal.json": "JSON",
        "exportModal.jsonDesc": "Для разработчиков",
        "exportModal.geojson": "GeoJSON",
        "exportModal.geojsonDesc": "Стандарт ГИС",
        "exportModal.includeStyles": "Включить информацию о стилях",
        "exportModal.export": "Экспортировать",
        
        // Buttons
        "btn.cancel": "Отмена",
        "btn.add": "Добавить",
        "btn.apply": "Применить",
        "btn.close": "Закрыть",
        
        // Status Messages
        "status.drawingActive": "режим рисования активен",
        "status.drawingStopped": "Рисование остановлено",
        "status.geometryAdded": "успешно добавлена",
        "status.geometryDeleted": "Геометрия удалена",
        "status.allCleared": "Все геометрии удалены",
        "status.styleApplied": "Стиль применён",
        "status.zoomedTo": "Приближено к геометрии",
        "status.copied": "Скопировано в буфер обмена",
        "status.copyFailed": "Ошибка копирования",
        "status.exported": "геометрий успешно экспортировано",
        "status.imported": "геометрий импортировано",
        "status.noGeometries": "Нет геометрий для экспорта",
        "status.basemap": "Базовый слой",
        "status.wktError": "Ошибка разбора WKT",
        "status.enterWkt": "Пожалуйста, введите WKT строку",
        
        // Confirmations
        "confirm.title": "Подтверждение",
        "confirm.delete": "Вы уверены, что хотите удалить эту геометрию?",
        "confirm.clearAll": "Вы уверены, что хотите удалить все геометрии?",
        "btn.confirm": "Подтвердить",
        
        // Geometry Types
        "geomType.Point": "Точка",
        "geomType.LineString": "Линия",
        "geomType.Polygon": "Полигон",
        "geomType.MultiPoint": "Мультиточка",
        "geomType.MultiLineString": "Мультилиния",
        "geomType.MultiPolygon": "Мультиполигон",
        
        // Language
        "lang.select": "Язык",
        "lang.tr": "Türkçe",
        "lang.en": "English",
        "lang.de": "Deutsch",
        "lang.ru": "Русский"
    }
};

// Current language
let currentLang = localStorage.getItem('wktviewer_lang') || 'tr';

/**
 * Get translation for a key
 */
function t(key, params = {}) {
    let text = translations[currentLang]?.[key] || translations['tr'][key] || key;
    
    // Replace parameters like {count}
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
}

/**
 * Change language
 */
function changeLanguage(lang) {
    if (!translations[lang]) {
        console.warn(`Language '${lang}' not supported`);
        return;
    }
    
    currentLang = lang;
    localStorage.setItem('wktviewer_lang', lang);
    
    // Update all elements with data-i18n attribute
    applyTranslations();
    
    // Update language selector
    updateLanguageSelector();
    
    // Update page title
    document.title = t('app.title');
    
    // Close language panel
    document.getElementById('langPanel')?.classList.remove('open');
    
    // Show status if function exists
    if (typeof showStatus === 'function') {
        showStatus(`${t('lang.' + lang)}`);
    }
}

/**
 * Apply translations to all elements
 */
function applyTranslations() {
    // Elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });
    
    // Elements with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });
    
    // Elements with data-i18n-title attribute (native tooltips)
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        el.title = t(key);
    });
    
    // Elements with data-i18n-tooltip attribute (custom tooltips)
    document.querySelectorAll('[data-i18n-tooltip]').forEach(el => {
        const key = el.getAttribute('data-i18n-tooltip');
        el.setAttribute('data-tooltip', t(key));
    });
}

/**
 * Update language selector UI
 */
function updateLanguageSelector() {
    const selector = document.getElementById('languageSelect');
    if (selector) {
        selector.value = currentLang;
    }
    
    // Update flag display if exists
    const flagDisplay = document.getElementById('currentLangFlag');
    if (flagDisplay) {
        const flagCodes = { tr: 'tr', en: 'gb', de: 'de', ru: 'ru' };
        const flagCode = flagCodes[currentLang] || 'tr';
        flagDisplay.className = `fi fi-${flagCode}`;
    }
}

/**
 * Get current language
 */
function getCurrentLang() {
    return currentLang;
}

/**
 * Toggle language panel
 */
function toggleLanguagePanel() {
    const panel = document.getElementById('langPanel');
    panel?.classList.toggle('open');
}

/**
 * Close language panel when clicking outside
 */
document.addEventListener('click', function(e) {
    const selector = document.querySelector('.language-selector');
    if (selector && !selector.contains(e.target)) {
        document.getElementById('langPanel')?.classList.remove('open');
    }
});

/**
 * Initialize i18n
 */
function initI18n() {
    applyTranslations();
    updateLanguageSelector();
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
} else {
    initI18n();
}
