exports.getTariffCalculatorHtml = async function getTariffCalculatorHtml() {
    // auth + tarifrechner-HTML fetchen

    // erstmal dummy kram zurück liefern aus der expert seite https://www.expert.de/pfaffenhofen/wertgarantie
    return staticTariffCalculatorHtml;
};


const queryStringParametersExpert = {
    appId: "dfcf11bf-dd44-4d03-b9c2-513f5b3b43c5",
    ns: "wgt",
    iframe: false,
    origin: "https://www.wertgarantie.de",
    referer: "https://www.wertgarantie.de/Home/Landingpage/Banner.aspx?partner=1755805&sortiment=1",
    agent: 1755805,
    _: 1585157378392
};

// Berechnungen js-file: https://wwwapi.serviceeu.com/rt/js/jq-hidden.min.js
// Call an: https://wwwapi.serviceeu.com/rt/api/calculate?token=wgt-bUaP7SbyLSPddrd4mAOJiw&boxid=default&category=mobile&type=9025&value=850&month=2&year=2020&_=1585325456129 --> Liefert Versicherungstarife als HTML zurück
//

const staticTariffCalculatorHtml = `
    <div class="wgt-container">
    <div class="wgt-tarif-processing"></div>
    <div class="wgt-row">
        <div class="wgt-col-xs-12">
            <div class="wgt-tarif-box">
                <div class="wgt-tabpanel">
                    <ul class="wgt-nav wgt-nav-tabs">
                        <li class="wgt-active"><a href=".wgt-mobile" data-link=""><svg class="wgt-svg" style="display:none" data-png="https://wwwapi.serviceeu.com/rt/img/mobile.png" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 182.265 314.51" style="enable-background:new 0 0 182.265 314.51;" xml:space="preserve">
                                    <path d="M158.852,0H23.425C10.463,0,0,10.264,0,22.91v268.71c0,12.637,10.463,22.889,23.425,22.889h135.426c12.933,0,23.414-10.252,23.414-22.889V22.91C182.265,10.264,171.784,0,158.852,0z M57.717,13.913h66.864c1.683,0,3.047,2.462,3.047,5.506c0,3.056-1.364,5.53-3.047,5.53H57.717c-1.7,0-3.047-2.474-3.047-5.53C54.67,16.375,56.018,13.913,57.717,13.913z M91.147,291.901c-8.247,0-14.954-6.559-14.954-14.628c0-8.059,6.707-14.595,14.954-14.595c8.222,0,14.924,6.537,14.924,14.595C106.071,285.341,99.37,291.901,91.147,291.901zM164.717,241.825H17.56V38.659h147.157V241.825z" /></svg><span>Mobile Telefone</span></a></li>
                        <li class=""><a href=".wgt-white-goods" data-link=""><svg class="wgt-svg" style="display:none" data-png="https://wwwapi.serviceeu.com/rt/img/white-goods.png" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 38" style="enable-background:new 0 0 32 38;" xml:space="preserve">
                                    <g>
                                        <path d="M27.9,0H3.4C1.5,0,0,1.5,0,3.4v31.2C0,36.5,1.5,38,3.4,38h24.6c1.9,0,3.4-1.5,3.4-3.4V3.4C31.3,1.5,29.8,0,27.9,0zM5.8,3.2h19.6c1.5,0,2.7,1.3,2.7,2.8v2.1h-25V6C3.1,4.5,4.3,3.2,5.8,3.2z M25.4,34.8H5.8c-1.5,0-2.7-1.3-2.7-2.8V9.3h25v22.7C28.1,33.5,26.9,34.8,25.4,34.8z" />
                                        <circle cx="5.7" cy="5.8" r="0.9" />
                                        <circle cx="8.3" cy="5.8" r="0.9" />
                                        <circle cx="10.7" cy="5.8" r="0.9" />
                                        <path d="M15.7,30.7c4.5,0,8.2-3.7,8.2-8.2c0-4.5-3.7-8.2-8.2-8.2c-4.5,0-8.2,3.7-8.2,8.2C7.5,27.1,11.1,30.7,15.7,30.7z M15.6,15.7c3.7,0,6.8,3,6.8,6.8s-3,6.8-6.8,6.8c-3.7,0-6.8-3-6.8-6.8S11.9,15.7,15.6,15.7z" />
                                        <path d="M15.6,28.1c3.2,0,5.8-2.6,5.8-5.8c0-3.2-4.3,0.6-7.7,0.6c-3.2,0-3.9-1.1-3.9-0.6C9.8,25.5,12.4,28.1,15.6,28.1z" />
                                    </g>
                                </svg><span>Haushalt</span></a></li>
                        <li class=""><a href=".wgt-electronic" data-link=""><svg class="wgt-svg" style="display:none" data-png="https://wwwapi.serviceeu.com/rt/img/electronic.png" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 37 31" style="enable-background:new 0 0 37 31;" xml:space="preserve">
                                    <path d="M34.991,0.054V0H34.81H2.172H1.991v0.054C0.923,0.128,0.127,0.981,0,2.016v0.182v21.588c0,0.419,0.108,0.771,0.29,1.089c0.417,0.736,1.032,1.109,1.882,1.109h11.911V29H11.82c-0.561,0-0.996,0.438-0.996,1c0,0.562,0.434,1,0.996,1h13.341c0.561,0,1.014-0.438,1.014-1c0-0.562-0.453-1-1.014-1h-2.263v-3.016H34.81c0.851,0,1.472-0.372,1.883-1.109C36.879,24.542,37,24.185,37,23.786V2.198V2.016C36.873,0.981,36.022,0.128,34.991,0.054z M34.991,2.198v21.588c0,0.128-0.054,0.182-0.181,0.182H2.172c-0.126,0-0.181-0.054-0.181-0.182V2.198V2.016h33V2.198z" /></svg><span>Multimedia</span></a></li>
                        <li class="wgt-tablink"><a href=".wgt-logo" data-link="https://www.wertgarantie.de/"><img src="https://wwwapi.serviceeu.com/rt/img/logo.png" /><span></span></a></li>
                    </ul>
                    <div class="wgt-tab-content">
                        <div class="wgt-tab-pane wgt-mobile wgt-active">
                            <div class="wgt-row">
                                <div class="wgt-col-xs-12">
                                    <div class="wgt-form"><input type="hidden" name="category" value="mobile" />
                                        <div class="wgt-row">
                                            <div class="wgt-col-xs-12 wgt-col-sm-4">
                                                <div class="wgt-tarif-select">
                                                    <div class="wgt-static-box"><input type="hidden" name="type" value="9025" /><b>Ger&auml;tetyp</b>: Handy/Smartphone</div><input type="text" name="value" placeholder="Bitte unsubventionierten Kaufpreis eingeben" style="" />
                                                </div>
                                                <div class="wgt-row" style="margin:0 0 0 0;">
                                                    <div class="wgt-col-xs-12 wgt-col-sm-3" style="padding: 10px 0 0 0;">Kaufdatum:</div>
                                                    <div class="wgt-col-xs-12 wgt-col-sm-5" style="padding: 0;">
                                                        <div class="wgt-tarif-select" style="margin: 0;">
                                                            <div class="wgt-select-box wgt-tarif-selectbox"><select name="month">
                                                                    <option value="" disabled selected>Monat</option>
                                                                    <option value="1">Januar</option>
                                                                    <option value="2">Februar</option>
                                                                    <option value="3">M&auml;rz</option>
                                                                    <option value="4">April</option>
                                                                    <option value="5">Mai</option>
                                                                    <option value="6">Juni</option>
                                                                    <option value="7">Juli</option>
                                                                    <option value="8">August</option>
                                                                    <option value="9">September</option>
                                                                    <option value="10">Oktober</option>
                                                                    <option value="11">November</option>
                                                                    <option value="12">Dezember</option>
                                                                </select></div>
                                                        </div>
                                                    </div>
                                                    <div class="wgt-col-xs-12 wgt-col-sm-4" style="padding:0">
                                                        <div class="wgt-tarif-select" style="margin: 0 0 15px 0;">
                                                            <div class="wgt-select-box wgt-tarif-selectbox"><select name="year">
                                                                    <option value="" disabled selected>Jahr</option>
                                                                    <option value="2020">2020</option>
                                                                    <option value="2019">2019</option>
                                                                    <option value="2018">2018</option>
                                                                    <option value="2017">2017</option>
                                                                    <option value="2016">2016</option>
                                                                    <option value="2015">2015</option>
                                                                    <option value="2014">2014</option>
                                                                    <option value="2013">2013</option>
                                                                    <option value="2012">2012</option>
                                                                    <option value="2011">2011</option>
                                                                    <option value="2010">2010</option>
                                                                    <option value="2009">2009</option>
                                                                    <option value="2008">2008</option>
                                                                    <option value="2007">2007</option>
                                                                    <option value="2006">2006</option>
                                                                    <option value="2005">2005</option>
                                                                    <option value="2004">2004</option>
                                                                    <option value="2003">2003</option>
                                                                    <option value="2002">2002</option>
                                                                    <option value="2001">2001</option>
                                                                    <option value="2000">2000</option>
                                                                    <option value="1999">1999</option>
                                                                    <option value="1998">1998</option>
                                                                    <option value="1997">1997</option>
                                                                    <option value="1996">1996</option>
                                                                    <option value="1995">1995</option>
                                                                    <option value="1994">1994</option>
                                                                    <option value="1993">1993</option>
                                                                    <option value="1992">1992</option>
                                                                    <option value="1991">1991</option>
                                                                    <option value="1990">1990</option>
                                                                    <option value="1989">1989</option>
                                                                    <option value="1988">1988</option>
                                                                    <option value="1987">1987</option>
                                                                    <option value="1986">1986</option>
                                                                    <option value="1985">1985</option>
                                                                    <option value="1984">1984</option>
                                                                    <option value="1983">1983</option>
                                                                    <option value="1982">1982</option>
                                                                    <option value="1981">1981</option>
                                                                    <option value="1980">1980</option>
                                                                </select></div>
                                                            <div class="mfSelectButton hover" style="margin-left: -3px"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="wgt-col-xs-12 wgt-col-sm-7"><button class="wgt-btn-blue wgt-btn-calculate  wgt-pull-down-2 ">Tarif berechnen</button></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="wgt-tab-pane wgt-white-goods ">
                            <div class="wgt-row">
                                <div class="wgt-col-xs-12">
                                    <div class="wgt-form"><input type="hidden" name="category" value="white-goods" />
                                        <div class="wgt-row">
                                            <div class="wgt-col-xs-12 wgt-col-sm-4">
                                                <div class="wgt-tarif-select">
                                                    <div class="wgt-select-box wgt-select-type"><select name="type">
                                                            <option value="" disabled selected>Ger&auml;tetyp</option>
                                                            <option value="40">Abzugshaube</option>
                                                            <option value="41">Backofen</option>
                                                            <option value="490139">Ceranfeld</option>
                                                            <option value="42">Dampfbackofen</option>
                                                            <option value="45">Dampfgarofen</option>
                                                            <option value="58">Elektroherd</option>
                                                            <option value="75">Gasherd</option>
                                                            <option value="74">Gefrierschrank</option>
                                                            <option value="80">Gefriertruhe</option>
                                                            <option value="52">Geschirrsp&uuml;ler</option>
                                                            <option value="490048">K&uuml;chenmaschine</option>
                                                            <option value="81">K&uuml;hl-Gefrierkombi</option>
                                                            <option value="71">K&uuml;hlschrank</option>
                                                            <option value="61">Kaffee-/Espressomaschine</option>
                                                            <option value="98">Klimaanlage</option>
                                                            <option value="76">Mikrowelle</option>
                                                            <option value="490261">Rasenm&auml;h-Roboter</option>
                                                            <option value="79">Schleuder</option>
                                                            <option value="39">Staubsauger</option>
                                                            <option value="51">W&auml;schetrockner</option>
                                                            <option value="50">Waschmaschine</option>
                                                            <option value="78">Waschtrockner</option>
                                                        </select></div><input type="text" name="value" placeholder="Bitte Kaufpreis eingeben" style="" />
                                                </div>
                                                <div class="wgt-row" style="margin:0 0 0 0;">
                                                    <div class="wgt-col-xs-12 wgt-col-sm-3" style="padding: 10px 0 0 0;">Kaufdatum:</div>
                                                    <div class="wgt-col-xs-12 wgt-col-sm-5" style="padding: 0;">
                                                        <div class="wgt-tarif-select" style="margin: 0;">
                                                            <div class="wgt-select-box wgt-tarif-selectbox"><select name="month">
                                                                    <option value="" disabled selected>Monat</option>
                                                                    <option value="1">Januar</option>
                                                                    <option value="2">Februar</option>
                                                                    <option value="3">M&auml;rz</option>
                                                                    <option value="4">April</option>
                                                                    <option value="5">Mai</option>
                                                                    <option value="6">Juni</option>
                                                                    <option value="7">Juli</option>
                                                                    <option value="8">August</option>
                                                                    <option value="9">September</option>
                                                                    <option value="10">Oktober</option>
                                                                    <option value="11">November</option>
                                                                    <option value="12">Dezember</option>
                                                                </select></div>
                                                        </div>
                                                    </div>
                                                    <div class="wgt-col-xs-12 wgt-col-sm-4" style="padding:0">
                                                        <div class="wgt-tarif-select" style="margin: 0 0 15px 0;">
                                                            <div class="wgt-select-box wgt-tarif-selectbox"><select name="year">
                                                                    <option value="" disabled selected>Jahr</option>
                                                                    <option value="2020">2020</option>
                                                                    <option value="2019">2019</option>
                                                                    <option value="2018">2018</option>
                                                                    <option value="2017">2017</option>
                                                                    <option value="2016">2016</option>
                                                                    <option value="2015">2015</option>
                                                                    <option value="2014">2014</option>
                                                                    <option value="2013">2013</option>
                                                                    <option value="2012">2012</option>
                                                                    <option value="2011">2011</option>
                                                                    <option value="2010">2010</option>
                                                                    <option value="2009">2009</option>
                                                                    <option value="2008">2008</option>
                                                                    <option value="2007">2007</option>
                                                                    <option value="2006">2006</option>
                                                                    <option value="2005">2005</option>
                                                                    <option value="2004">2004</option>
                                                                    <option value="2003">2003</option>
                                                                    <option value="2002">2002</option>
                                                                    <option value="2001">2001</option>
                                                                    <option value="2000">2000</option>
                                                                    <option value="1999">1999</option>
                                                                    <option value="1998">1998</option>
                                                                    <option value="1997">1997</option>
                                                                    <option value="1996">1996</option>
                                                                    <option value="1995">1995</option>
                                                                    <option value="1994">1994</option>
                                                                    <option value="1993">1993</option>
                                                                    <option value="1992">1992</option>
                                                                    <option value="1991">1991</option>
                                                                    <option value="1990">1990</option>
                                                                    <option value="1989">1989</option>
                                                                    <option value="1988">1988</option>
                                                                    <option value="1987">1987</option>
                                                                    <option value="1986">1986</option>
                                                                    <option value="1985">1985</option>
                                                                    <option value="1984">1984</option>
                                                                    <option value="1983">1983</option>
                                                                    <option value="1982">1982</option>
                                                                    <option value="1981">1981</option>
                                                                    <option value="1980">1980</option>
                                                                </select></div>
                                                            <div class="mfSelectButton hover" style="margin-left: -3px"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="wgt-col-xs-12 wgt-col-sm-7"><button class="wgt-btn-blue wgt-btn-calculate  wgt-pull-down-2 ">Tarif berechnen</button></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="wgt-tab-pane wgt-electronic ">
                            <div class="wgt-row">
                                <div class="wgt-col-xs-12">
                                    <div class="wgt-form"><input type="hidden" name="category" value="electronic" />
                                        <div class="wgt-row">
                                            <div class="wgt-col-xs-12 wgt-col-sm-4">
                                                <div class="wgt-tarif-select">
                                                    <div class="wgt-select-box wgt-select-type"><select name="type">
                                                            <option value="" disabled selected>Ger&auml;tetyp</option>
                                                            <option value="70">Auto-HiFi</option>
                                                            <option value="25">Blu-Ray Ger&auml;t</option>
                                                            <option value="56">Camcorder</option>
                                                            <option value="89">Digital-Receiver</option>
                                                            <option value="490128">Drucker</option>
                                                            <option value="68">DVD-Anlage</option>
                                                            <option value="77">DVD-Player</option>
                                                            <option value="67">DVD/HD-Recorder</option>
                                                            <option value="490296">Elektrospielzeug</option>
                                                            <option value="47">Fax-Ger&auml;t</option>
                                                            <option value="72">Festnetztelefon</option>
                                                            <option value="57">HiFi</option>
                                                            <option value="64">ISDN-/Telefonanlage</option>
                                                            <option value="60">Kamera</option>
                                                            <option value="63">LCD/LED-TV</option>
                                                            <option value="91">Monitor</option>
                                                            <option value="35">Multimedia Center</option>
                                                            <option value="30">Notebook</option>
                                                            <option value="31">PC System</option>
                                                            <option value="490173">PDA</option>
                                                            <option value="65">Plasma-TV</option>
                                                            <option value="62">R&uuml;ckprojektionsger&auml;t</option>
                                                            <option value="55">SAT-Anlage</option>
                                                            <option value="490141">Scanner</option>
                                                            <option value="9026">Smartwatch</option>
                                                            <option value="490185">Spielkonsole</option>
                                                            <option value="97">Tablet-Computer</option>
                                                            <option value="53">TV</option>
                                                            <option value="66">TV + Anschlussger&auml;t</option>
                                                            <option value="32">TV / Decoder</option>
                                                            <option value="54">Video</option>
                                                            <option value="69">Video/DVD Kombi</option>
                                                        </select></div><input type="text" name="value" placeholder="Bitte Kaufpreis eingeben" style="" />
                                                </div>
                                                <div class="wgt-row" style="margin:0 0 0 0;">
                                                    <div class="wgt-col-xs-12 wgt-col-sm-3" style="padding: 10px 0 0 0;">Kaufdatum:</div>
                                                    <div class="wgt-col-xs-12 wgt-col-sm-5" style="padding: 0;">
                                                        <div class="wgt-tarif-select" style="margin: 0;">
                                                            <div class="wgt-select-box wgt-tarif-selectbox"><select name="month">
                                                                    <option value="" disabled selected>Monat</option>
                                                                    <option value="1">Januar</option>
                                                                    <option value="2">Februar</option>
                                                                    <option value="3">M&auml;rz</option>
                                                                    <option value="4">April</option>
                                                                    <option value="5">Mai</option>
                                                                    <option value="6">Juni</option>
                                                                    <option value="7">Juli</option>
                                                                    <option value="8">August</option>
                                                                    <option value="9">September</option>
                                                                    <option value="10">Oktober</option>
                                                                    <option value="11">November</option>
                                                                    <option value="12">Dezember</option>
                                                                </select></div>
                                                        </div>
                                                    </div>
                                                    <div class="wgt-col-xs-12 wgt-col-sm-4" style="padding:0">
                                                        <div class="wgt-tarif-select" style="margin: 0 0 15px 0;">
                                                            <div class="wgt-select-box wgt-tarif-selectbox"><select name="year">
                                                                    <option value="" disabled selected>Jahr</option>
                                                                    <option value="2020">2020</option>
                                                                    <option value="2019">2019</option>
                                                                    <option value="2018">2018</option>
                                                                    <option value="2017">2017</option>
                                                                    <option value="2016">2016</option>
                                                                    <option value="2015">2015</option>
                                                                    <option value="2014">2014</option>
                                                                    <option value="2013">2013</option>
                                                                    <option value="2012">2012</option>
                                                                    <option value="2011">2011</option>
                                                                    <option value="2010">2010</option>
                                                                    <option value="2009">2009</option>
                                                                    <option value="2008">2008</option>
                                                                    <option value="2007">2007</option>
                                                                    <option value="2006">2006</option>
                                                                    <option value="2005">2005</option>
                                                                    <option value="2004">2004</option>
                                                                    <option value="2003">2003</option>
                                                                    <option value="2002">2002</option>
                                                                    <option value="2001">2001</option>
                                                                    <option value="2000">2000</option>
                                                                    <option value="1999">1999</option>
                                                                    <option value="1998">1998</option>
                                                                    <option value="1997">1997</option>
                                                                    <option value="1996">1996</option>
                                                                    <option value="1995">1995</option>
                                                                    <option value="1994">1994</option>
                                                                    <option value="1993">1993</option>
                                                                    <option value="1992">1992</option>
                                                                    <option value="1991">1991</option>
                                                                    <option value="1990">1990</option>
                                                                    <option value="1989">1989</option>
                                                                    <option value="1988">1988</option>
                                                                    <option value="1987">1987</option>
                                                                    <option value="1986">1986</option>
                                                                    <option value="1985">1985</option>
                                                                    <option value="1984">1984</option>
                                                                    <option value="1983">1983</option>
                                                                    <option value="1982">1982</option>
                                                                    <option value="1981">1981</option>
                                                                    <option value="1980">1980</option>
                                                                </select></div>
                                                            <div class="mfSelectButton hover" style="margin-left: -3px"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="wgt-col-xs-12 wgt-col-sm-7"><button class="wgt-btn-blue wgt-btn-calculate  wgt-pull-down-2 ">Tarif berechnen</button></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
