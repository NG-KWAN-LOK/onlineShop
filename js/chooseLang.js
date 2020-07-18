function setLanguage(languageIndex) {
  var languageContainer = null;
  if (languageIndex === 1) {
    console.log("zh-TW", L_zhTW);
    languageContainer = L_zhTW;
  } else if (languageIndex === 2) {
    console.log("ENG", L_Eng);
    languageContainer = L_Eng;
  } else if (languageIndex === 3) {
    console.log("JP");
    languageContainer = L_JP;
  }
  console.log("languageContainer: " + languageContainer.title);
  document.title = languageContainer.title;
  document.getElementById("topFooterLang_topHome").innerHTML =
    languageContainer.topFooterLang_topHome;
  document.getElementById("topFooterLang_topOnlineMap").innerHTML =
    languageContainer.topFooterLang_topOnlineMap;
  document.getElementById("topFooterLang_topBulidingList").innerHTML =
    languageContainer.topFooterLang_topBulidingList;
  document.getElementById("topFooterLang_topResidentList").innerHTML =
    languageContainer.topFooterLang_topResidentList;
  document.getElementById("topFooterLang_topDarkMode").innerHTML =
    languageContainer.topFooterLang_topDarkMode;
  document.getElementById("topFooterLang_phoneHome").innerHTML =
    languageContainer.topFooterLang_phoneHome;
  document.getElementById("topFooterLang_phoneOnlineMap").innerHTML =
    languageContainer.topFooterLang_phoneOnlineMap;
  document.getElementById("topFooterLang_phoneBulidingList").innerHTML =
    languageContainer.topFooterLang_phoneBulidingList;
  document.getElementById("topFooterLang_phoneResidentList").innerHTML =
    languageContainer.topFooterLang_phoneResidentList;
  document.getElementById("topFooterLang_phoneDarkMode").innerHTML =
    languageContainer.topFooterLang_phoneDarkMode;
  document.getElementById("footer__content__weblogo__underText").innerHTML =
    languageContainer.footer__content__weblogo__underText;
  document.getElementById("topFooterLang_fotterTitle").innerHTML =
    languageContainer.topFooterLang_fotterTitle;
  document.getElementById("topFooterLang_fotterAddress").innerHTML =
    languageContainer.topFooterLang_fotterAddress;
  document.getElementById("topFooterLang_fotterAbout").innerHTML =
    languageContainer.topFooterLang_fotterAbout;
  document.getElementById("topFooterLang_fotterTNC").innerHTML =
    languageContainer.topFooterLang_fotterTNC;
  document.getElementById("topFooterLang_fotterDynmap").innerHTML =
    languageContainer.topFooterLang_fotterDynmap;
  document.getElementById("topFooterLang_fotterCopyright").innerHTML =
    languageContainer.topFooterLang_fotterCopyright;
  //document.getElementById("").innerHTML = L_zhTW[16];

  document.getElementById("discover_title_discover").innerHTML =
    languageContainer.discover_title_discover;
  document.getElementById("discover_text_discover").innerHTML =
    languageContainer.discover_text_discover;
  document.getElementById("discover_subtitle_discover").innerHTML =
    languageContainer.discover_subtitle_discover;
  document.getElementById("discover_content_atoppadding_webMap").innerHTML =
    languageContainer.discover_content_atoppadding_webMap;
  document.getElementById("discover_content_apadding_webMap").innerHTML =
    languageContainer.discover_content_apadding_webMap;
  document.getElementById("discover_content_atoppadding_buildingList").innerHTML =
    languageContainer.discover_content_atoppadding_buildingList;
  document.getElementById("discover_content_apadding_buildingList").innerHTML =
    languageContainer.discover_content_apadding_buildingList;
  document.getElementById("discover_content_atoppadding_areaMap").innerHTML =
    languageContainer.discover_content_atoppadding_areaMap;
  document.getElementById("discover_content_apadding_areaMap").innerHTML =
    languageContainer.discover_content_apadding_areaMap;
  document.getElementById("discover_content_atoppadding_gps").innerHTML =
    languageContainer.discover_content_atoppadding_gps;
  document.getElementById("discover_content_apadding_gps").innerHTML =
    languageContainer.discover_content_apadding_gps;
  document.getElementById("discover_subtitle_basic").innerHTML =
    languageContainer.discover_subtitle_basic;
  document.getElementById("discover_content_atoppadding_place").innerHTML =
    languageContainer.discover_content_atoppadding_place;
  document.getElementById("discover_content_apadding_place").innerHTML =
    languageContainer.discover_content_apadding_place;
  document.getElementById("discover_content_atoppadding_history").innerHTML =
    languageContainer.discover_content_atoppadding_history;
  document.getElementById("discover_content_apadding_history").innerHTML =
    languageContainer.discover_content_apadding_history;
  document.getElementById("discover_content_atoppadding_building").innerHTML =
    languageContainer.discover_content_atoppadding_building;
  document.getElementById("discover_content_apadding_building").innerHTML =
    languageContainer.discover_content_apadding_building;
  document.getElementById("discover_content_atoppadding_view").innerHTML =
    languageContainer.discover_content_atoppadding_view;
  document.getElementById("discover_content_apadding_view").innerHTML =
    languageContainer.discover_content_apadding_view;

  document.getElementById("discover_subtitle_do").innerHTML =
    languageContainer.discover_subtitle_do;
  document.getElementById("discover_content_atoppadding_dream").innerHTML =
    languageContainer.discover_content_atoppadding_dream;
  document.getElementById("discover_content_apadding_dream").innerHTML =
    languageContainer.discover_content_apadding_dream;
  document.getElementById("discover_content_atoppadding_enjoy").innerHTML =
    languageContainer.discover_content_atoppadding_enjoy;
  document.getElementById("discover_content_apadding_enjoy").innerHTML =
    languageContainer.discover_content_apadding_enjoy;
  document.getElementById("discover_content_atoppadding_playCountry").innerHTML =
    languageContainer.discover_content_atoppadding_playCountry;
  document.getElementById("discover_content_apadding_playCountry").innerHTML =
    languageContainer.discover_content_apadding_playCountry;
  document.getElementById("discover_content_atoppadding_creatWorld").innerHTML =
    languageContainer.discover_content_atoppadding_creatWorld;
  document.getElementById("discover_content_apadding_creatWorld").innerHTML =
    languageContainer.discover_content_apadding_creatWorld;
  document.getElementById("discover_subtitle_activity").innerHTML =
    languageContainer.discover_subtitle_activity;
  document.getElementById("discover_content_atoppadding_playaround").innerHTML =
    languageContainer.discover_content_atoppadding_playaround;
  document.getElementById("discover_content_apadding_creatWorld").innerHTML =
    languageContainer.discover_content_apadding_creatWorld;
  document.getElementById("discover_content_atoppadding_flower").innerHTML =
    languageContainer.discover_content_atoppadding_flower;
  document.getElementById("discover_content_apadding_flower").innerHTML =
    languageContainer.discover_content_apadding_flower;
  document.getElementById("discover_content_atoppadding_music").innerHTML =
    languageContainer.discover_content_atoppadding_music;
  document.getElementById("discover_content_apadding_music").innerHTML =
    languageContainer.discover_content_apadding_music;
  document.getElementById("discover_content_atoppadding_firework").innerHTML =
    languageContainer.discover_content_atoppadding_firework;
  document.getElementById("discover_content_apadding_firework").innerHTML =
    languageContainer.discover_content_apadding_firework;
  document.getElementById("discover_subtitle_method").innerHTML =
    languageContainer.discover_subtitle_method;
  document.getElementById("discover_content_atoppadding_airport").innerHTML =
    languageContainer.discover_content_atoppadding_airport;
  document.getElementById("discover_content_atoppadding_dock").innerHTML =
    languageContainer.discover_content_atoppadding_dock;
  document.getElementById("discover_content_atoppadding_land").innerHTML =
    languageContainer.discover_content_atoppadding_land;
  document.getElementById("discover_content_atoppadding_portal").innerHTML =
    languageContainer.discover_content_atoppadding_portal;
  document.getElementById("discover_subtitle_traffic").innerHTML =
    languageContainer.discover_subtitle_traffic;
  document.getElementById("discover_content_atoppadding_highway").innerHTML =
    languageContainer.discover_content_atoppadding_highway;
  document.getElementById("discover_content_apadding_highway").innerHTML =
    languageContainer.discover_content_apadding_highway;
  document.getElementById("discover_content_atoppadding_airportWay").innerHTML =
    languageContainer.discover_content_atoppadding_airportWay;
  document.getElementById("discover_content_apadding_airportWay").innerHTML =
    languageContainer.discover_content_apadding_airportWay;
  document.getElementById("discover_content_atoppadding_mrt").innerHTML =
    languageContainer.discover_content_atoppadding_mrt;
  document.getElementById("discover_content_apadding_mrt").innerHTML =
    languageContainer.discover_content_apadding_mrt;
  document.getElementById("discover_content_atoppadding_downMrt").innerHTML =
    languageContainer.discover_content_atoppadding_downMrt;
  document.getElementById("discover_content_apadding_downMrt").innerHTML =
    languageContainer.discover_content_apadding_downMrt;
  document.getElementById("reality_project_title").innerHTML =
    languageContainer.reality_project_title;
  document.getElementById("reality_project_osaka").innerHTML =
    languageContainer.reality_project_osaka;
  document.getElementById("reality_project_tokyo").innerHTML =
    languageContainer.reality_project_tokyo;
  document.getElementById("reality_project_hongkong").innerHTML =
    languageContainer.reality_project_hongkong;
  document.getElementById("reality_project_taipei").innerHTML =
    languageContainer.reality_project_taipei;
  document.getElementById("reality_project_paletteTown").innerHTML =
    languageContainer.reality_project_paletteTown;
  document.getElementById("reality_project_blackRiver").innerHTML =
    languageContainer.reality_project_blackRiver;
  document.getElementById("reality_project_royho").innerHTML =
    languageContainer.reality_project_royho;
  document.getElementById("reality_project_bridge").innerHTML =
    languageContainer.reality_project_bridge;
  document.getElementById("reality_project_playground").innerHTML =
    languageContainer.reality_project_playground;
  document.getElementById("reality_project_playground_sub").innerHTML =
    languageContainer.reality_project_playground_sub;
  document.getElementById("reality_project_school").innerHTML =
    languageContainer.reality_project_school;
  document.getElementById("reality_project_library").innerHTML =
    languageContainer.reality_project_library;
  document.getElementById("reality_project_cityHall").innerHTML =
    languageContainer.reality_project_cityHall;
  document.getElementById("reality_project_cityHall_sub").innerHTML =
    languageContainer.reality_project_cityHall_sub;
  document.getElementById("reality_project_hospital").innerHTML =
    languageContainer.reality_project_hospital;
  document.getElementById("reality_project_hospital_sub").innerHTML =
    languageContainer.reality_project_hospital_sub;
  document.getElementById("reality_project_police").innerHTML =
    languageContainer.reality_project_police;
  document.getElementById("reality_project_police_sub").innerHTML =
    languageContainer.reality_project_police_sub;
  document.getElementById("reality_project_fireMan").innerHTML =
    languageContainer.reality_project_fireMan;
  document.getElementById("reality_project_fireMan_sub").innerHTML =
    languageContainer.reality_project_fireMan_sub;
  document.getElementById("reality_project_island_dock").innerHTML =
    languageContainer.reality_project_island_dock;
  document.getElementById("reality_project_island_dock_sub").innerHTML =
    languageContainer.reality_project_island_dock_sub;
  document.getElementById("reality_project_firstCity").innerHTML =
    languageContainer.reality_project_firstCity;
  document.getElementById("reality_project_nuclear").innerHTML =
    languageContainer.reality_project_nuclear;
  document.getElementById("reality_project_nuclear_sub").innerHTML =
    languageContainer.reality_project_nuclear_sub;
  document.getElementById("reality_project_clock").innerHTML =
    languageContainer.reality_project_clock;
  document.getElementById("reality_project_park").innerHTML =
    languageContainer.reality_project_park;
  document.getElementById("reality_project_rocket").innerHTML =
    languageContainer.reality_project_rocket;
  document.getElementById("reality_project_rocket_sub").innerHTML =
    languageContainer.reality_project_rocket_sub;
  document.getElementById("reality_project_garden").innerHTML =
    languageContainer.reality_project_garden;
  document.getElementById("reality_project_building").innerHTML =
    languageContainer.reality_project_building;
}
