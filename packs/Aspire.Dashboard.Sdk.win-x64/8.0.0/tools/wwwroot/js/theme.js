import {
    accentBaseColor,
    baseLayerLuminance,
    SwatchRGB,
    fillColor,
    neutralLayerL2
} from "/_content/Microsoft.FluentUI.AspNetCore.Components/Microsoft.FluentUI.AspNetCore.Components.lib.module.js";

const currentThemeCookieName = "currentTheme";
const themeSettingSystem = "System";
const themeSettingDark = "Dark";
const themeSettingLight = "Light";
const darkThemeLuminance = 0.19;
const lightThemeLuminance = 1.0;

/**
 * Updates the current theme on the site based on the specified theme
 * @param {string} specifiedTheme
 */
export function updateTheme(specifiedTheme) {
    const effectiveTheme = getEffectiveTheme(specifiedTheme);

    applyTheme(effectiveTheme);
    setThemeCookie(specifiedTheme);
}

/**
 * Returns the value of the currentTheme cookie, or System if the cookie is not set.
 * @returns {string}
 */
export function getThemeCookieValue() {
    return getCookieValue(currentThemeCookieName) ?? themeSettingSystem;
}

/**
 * Returns the current system theme (Light or Dark)
 * @returns {string}
 */
function getSystemTheme() {
    let matched = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (matched) {
        return themeSettingDark;
    } else {
        return themeSettingLight;
    }
}

/**
 * Sets the currentTheme cookie to the specified value.
 * @param {string} theme
 */
function setThemeCookie(theme) {
    document.cookie = `${currentThemeCookieName}=${theme}`;
}

/**
 * Sets the document data-theme attribute to the specified value.
 * @param {string} theme The theme to set. Should be Light or Dark.
 */
function setThemeOnDocument(theme) {

    if (theme === themeSettingDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else /* Light */ {
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

/**
 * 
 * @param {string} theme The theme to use. Should be Light or Dark.
 */
function setBaseLayerLuminance(theme) {
    const baseLayerLuminanceValue = getBaseLayerLuminanceForTheme(theme);
    baseLayerLuminance.withDefault(baseLayerLuminanceValue);
}

/**
 * Returns the value of the specified cookie, or the empty string if the cookie is not present
 * @param {string} cookieName
 * @returns {string}
 */
function getCookieValue(cookieName) {
    const cookiePieces = document.cookie.split(';');
    for (let index = 0; index < cookiePieces.length; index++) {
        if (cookiePieces[index].trim().startsWith(cookieName)) {
            const cookieKeyValue = cookiePieces[index].split('=');
            if (cookieKeyValue.length > 1) {
                return cookieKeyValue[1];
            }
        }
    }

    return "";
}

/**
 * Converts a setting value for the theme (Light, Dark, System or null/empty) into the effective theme that should be applied
 * @param {string} specifiedTheme The setting value to use to determine the effective theme. Anything other than Light or Dark will be treated as System
 * @returns {string} The actual theme to use based on the supplied setting. Will be either Light or Dark.
 */
function getEffectiveTheme(specifiedTheme) {
    if (specifiedTheme === themeSettingLight ||
        specifiedTheme === themeSettingDark) {
        return specifiedTheme;
    } else {
        return getSystemTheme();
    }
}

/**
 * 
 * @param {string} theme The theme to use. Should be Light or Dark
 * @returns {string}
 */
function getBaseLayerLuminanceForTheme(theme) {
    if (theme === themeSettingDark) {
        return darkThemeLuminance;
    } else /* Light */ {
        return lightThemeLuminance;
    }
}

/**
 * Configures the accent color palette based on the .NET purple
 */
function setAccentColor() {
    // Convert the base color ourselves to avoid pulling in the
    // @microsoft/fast-colors library just for one call to parseColorHexRGB
    const baseColor = { // #512BD4
        r: 0x51 / 255.0,
        g: 0x2B / 255.0,
        b: 0xD4 / 255.0
    };

    const accentBase = SwatchRGB.create(baseColor.r, baseColor.g, baseColor.b);
    accentBaseColor.withDefault(accentBase);
}

/**
 * Configures the default background color to use for the body
 */
function setFillColor() {
    // Design specs say we should use --neutral-layer-2 as the fill color
    // for the body. Most of the web components use --fill-color as their
    // background color, so we need to make sure they get --neutral-layer-2
    // when they request --fill-color.
    fillColor.setValueFor(document.body, neutralLayerL2);
}

/**
 * Applies the Light or Dark theme to the entire site
 * @param {string} theme The theme to use. Should be Light or Dark
 */
function applyTheme(theme) {
    setBaseLayerLuminance(theme);
    setAccentColor();
    setFillColor();
    setThemeOnDocument(theme);
}

function initializeTheme() {
    const themeCookieValue = getThemeCookieValue();
    const effectiveTheme = getEffectiveTheme(themeCookieValue);

    applyTheme(effectiveTheme);
}

initializeTheme();

// SIG // Begin signature block
// SIG // MIInzAYJKoZIhvcNAQcCoIInvTCCJ7kCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // oPII5bbu2R/7zDLxVnFCNLHREsqKUWJzVwPpFQqDtGGg
// SIG // gg2FMIIGAzCCA+ugAwIBAgITMwAAA64tNVHIU49VHQAA
// SIG // AAADrjANBgkqhkiG9w0BAQsFADB+MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBT
// SIG // aWduaW5nIFBDQSAyMDExMB4XDTIzMTExNjE5MDg1OVoX
// SIG // DTI0MTExNDE5MDg1OVowdDELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjEeMBwGA1UEAxMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
// SIG // 9CD8pjY3wxCoPmMhOkow7ycCltfqYnqk4wGNApzh2dTY
// SIG // +YqxozWTzJUOB38VxsgFQmXBFhOMdrGYGpvO9kdbNPkw
// SIG // HpTrW6hZqFuLLiRwGKEx4ZM5zVSqbHJuX2fPfUJ0Xmb+
// SIG // VrVsGw/BwBV2zz0rVtiSgqj3GeeGOsG7llfWyrSjyJqm
// SIG // 5DHE3o04BAI/NuhkHOv04euiqJGvHFCL8+fXvyD9OAxq
// SIG // 4fcJKtoyBb0PBA3oMNQeCsiUyLO+voZqVTOUsAWY0bN5
// SIG // YjkK4nq5DVaNdVrrowd5AX9gmz6D/TJTssns6pDCG00Y
// SIG // +Dh3ipWpnVmkhYcByyUSEKX3PLC8DkiAQQIDAQABo4IB
// SIG // gjCCAX4wHwYDVR0lBBgwFgYKKwYBBAGCN0wIAQYIKwYB
// SIG // BQUHAwMwHQYDVR0OBBYEFIcf73Spl4cHOFoll27H9COd
// SIG // 4fE/MFQGA1UdEQRNMEukSTBHMS0wKwYDVQQLEyRNaWNy
// SIG // b3NvZnQgSXJlbGFuZCBPcGVyYXRpb25zIExpbWl0ZWQx
// SIG // FjAUBgNVBAUTDTIzMDAxMis1MDE4MzYwHwYDVR0jBBgw
// SIG // FoAUSG5k5VAF04KqFzc3IrVtqMp1ApUwVAYDVR0fBE0w
// SIG // SzBJoEegRYZDaHR0cDovL3d3dy5taWNyb3NvZnQuY29t
// SIG // L3BraW9wcy9jcmwvTWljQ29kU2lnUENBMjAxMV8yMDEx
// SIG // LTA3LTA4LmNybDBhBggrBgEFBQcBAQRVMFMwUQYIKwYB
// SIG // BQUHMAKGRWh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9w
// SIG // a2lvcHMvY2VydHMvTWljQ29kU2lnUENBMjAxMV8yMDEx
// SIG // LTA3LTA4LmNydDAMBgNVHRMBAf8EAjAAMA0GCSqGSIb3
// SIG // DQEBCwUAA4ICAQBqyWA1Eu7PKNMjaaxl0V7gJ0XBysUo
// SIG // xZluMHJXFE2LEGZIZ2zMLYVjOnAGG/4dluRjSrZZo/8v
// SIG // wk4Xt8v6NBB9ofo8H1P/XidHytWTv9lg9MYu++6lPmu5
// SIG // fCozD3cI2NLZPW2BBhGX2D0R8tQBj0FbmZRuIucpiQ7D
// SIG // K3CHKlfKcc7MP8pPzuMv55Tox8+KFQD1NG6+bfbYA/BN
// SIG // PBkg4tyOh+exbaHfcNuodDJUIjq9dF6oa+Yjy0u0pUMI
// SIG // /B1t+8m6rJo0KSoZlrpesYl0jRhpt+hmqx8uENXoGJcY
// SIG // ZVJ5N2Skq90LViKNRhi9N4U+e8c4y9uXyomUF/6viCPJ
// SIG // 7huTNEJo75ehIJba+IWd3txUEc0R3y6DT6txC6cW1nR/
// SIG // LTbo9I/8fQq538G5IvJ+e5iSiOSVVkVk0i5m03Awy5E2
// SIG // ZSS4PVdQSCcFxmN4tpEfYuR7AAy/GJVtIDFlUpSgdXok
// SIG // pSui5hYtK1R9enXXvo+U/xGkLRc+qp4De3dZbzu7pOq7
// SIG // V/jCyhuCw0bEIAU4urCGIip7TI6GBRzD7yPzjFIqeZY7
// SIG // S4rVW5BRn2oEqpm8Su6yTIQvMIk8x2pwYNUa2339Z4gW
// SIG // 5xW21eFA5mLpo7NRSKRQms5OgAA18aCgqOU7Ds0h6q/Y
// SIG // B4BmEAtoTMl/TBiyKaMGAlEcdy+5FIhmzojMGjCCB3ow
// SIG // ggVioAMCAQICCmEOkNIAAAAAAAMwDQYJKoZIhvcNAQEL
// SIG // BQAwgYgxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
// SIG // aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQK
// SIG // ExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xMjAwBgNVBAMT
// SIG // KU1pY3Jvc29mdCBSb290IENlcnRpZmljYXRlIEF1dGhv
// SIG // cml0eSAyMDExMB4XDTExMDcwODIwNTkwOVoXDTI2MDcw
// SIG // ODIxMDkwOVowfjELMAkGA1UEBhMCVVMxEzARBgNVBAgT
// SIG // Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
// SIG // BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEoMCYG
// SIG // A1UEAxMfTWljcm9zb2Z0IENvZGUgU2lnbmluZyBQQ0Eg
// SIG // MjAxMTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoC
// SIG // ggIBAKvw+nIQHC6t2G6qghBNNLrytlghn0IbKmvpWlCq
// SIG // uAY4GgRJun/DDB7dN2vGEtgL8DjCmQawyDnVARQxQtOJ
// SIG // DXlkh36UYCRsr55JnOloXtLfm1OyCizDr9mpK656Ca/X
// SIG // llnKYBoF6WZ26DJSJhIv56sIUM+zRLdd2MQuA3WraPPL
// SIG // bfM6XKEW9Ea64DhkrG5kNXimoGMPLdNAk/jj3gcN1Vx5
// SIG // pUkp5w2+oBN3vpQ97/vjK1oQH01WKKJ6cuASOrdJXtjt
// SIG // 7UORg9l7snuGG9k+sYxd6IlPhBryoS9Z5JA7La4zWMW3
// SIG // Pv4y07MDPbGyr5I4ftKdgCz1TlaRITUlwzluZH9TupwP
// SIG // rRkjhMv0ugOGjfdf8NBSv4yUh7zAIXQlXxgotswnKDgl
// SIG // mDlKNs98sZKuHCOnqWbsYR9q4ShJnV+I4iVd0yFLPlLE
// SIG // tVc/JAPw0XpbL9Uj43BdD1FGd7P4AOG8rAKCX9vAFbO9
// SIG // G9RVS+c5oQ/pI0m8GLhEfEXkwcNyeuBy5yTfv0aZxe/C
// SIG // HFfbg43sTUkwp6uO3+xbn6/83bBm4sGXgXvt1u1L50kp
// SIG // pxMopqd9Z4DmimJ4X7IvhNdXnFy/dygo8e1twyiPLI9A
// SIG // N0/B4YVEicQJTMXUpUMvdJX3bvh4IFgsE11glZo+TzOE
// SIG // 2rCIF96eTvSWsLxGoGyY0uDWiIwLAgMBAAGjggHtMIIB
// SIG // 6TAQBgkrBgEEAYI3FQEEAwIBADAdBgNVHQ4EFgQUSG5k
// SIG // 5VAF04KqFzc3IrVtqMp1ApUwGQYJKwYBBAGCNxQCBAwe
// SIG // CgBTAHUAYgBDAEEwCwYDVR0PBAQDAgGGMA8GA1UdEwEB
// SIG // /wQFMAMBAf8wHwYDVR0jBBgwFoAUci06AjGQQ7kUBU7h
// SIG // 6qfHMdEjiTQwWgYDVR0fBFMwUTBPoE2gS4ZJaHR0cDov
// SIG // L2NybC5taWNyb3NvZnQuY29tL3BraS9jcmwvcHJvZHVj
// SIG // dHMvTWljUm9vQ2VyQXV0MjAxMV8yMDExXzAzXzIyLmNy
// SIG // bDBeBggrBgEFBQcBAQRSMFAwTgYIKwYBBQUHMAKGQmh0
// SIG // dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2VydHMv
// SIG // TWljUm9vQ2VyQXV0MjAxMV8yMDExXzAzXzIyLmNydDCB
// SIG // nwYDVR0gBIGXMIGUMIGRBgkrBgEEAYI3LgMwgYMwPwYI
// SIG // KwYBBQUHAgEWM2h0dHA6Ly93d3cubWljcm9zb2Z0LmNv
// SIG // bS9wa2lvcHMvZG9jcy9wcmltYXJ5Y3BzLmh0bTBABggr
// SIG // BgEFBQcCAjA0HjIgHQBMAGUAZwBhAGwAXwBwAG8AbABp
// SIG // AGMAeQBfAHMAdABhAHQAZQBtAGUAbgB0AC4gHTANBgkq
// SIG // hkiG9w0BAQsFAAOCAgEAZ/KGpZjgVHkaLtPYdGcimwuW
// SIG // EeFjkplCln3SeQyQwWVfLiw++MNy0W2D/r4/6ArKO79H
// SIG // qaPzadtjvyI1pZddZYSQfYtGUFXYDJJ80hpLHPM8QotS
// SIG // 0LD9a+M+By4pm+Y9G6XUtR13lDni6WTJRD14eiPzE32m
// SIG // kHSDjfTLJgJGKsKKELukqQUMm+1o+mgulaAqPyprWElj
// SIG // HwlpblqYluSD9MCP80Yr3vw70L01724lruWvJ+3Q3fMO
// SIG // r5kol5hNDj0L8giJ1h/DMhji8MUtzluetEk5CsYKwsat
// SIG // ruWy2dsViFFFWDgycScaf7H0J/jeLDogaZiyWYlobm+n
// SIG // t3TDQAUGpgEqKD6CPxNNZgvAs0314Y9/HG8VfUWnduVA
// SIG // KmWjw11SYobDHWM2l4bf2vP48hahmifhzaWX0O5dY0Hj
// SIG // Wwechz4GdwbRBrF1HxS+YWG18NzGGwS+30HHDiju3mUv
// SIG // 7Jf2oVyW2ADWoUa9WfOXpQlLSBCZgB/QACnFsZulP0V3
// SIG // HjXG0qKin3p6IvpIlR+r+0cjgPWe+L9rt0uX4ut1eBrs
// SIG // 6jeZeRhL/9azI2h15q/6/IvrC4DqaTuv/DDtBEyO3991
// SIG // bWORPdGdVk5Pv4BXIqF4ETIheu9BCrE/+6jMpF3BoYib
// SIG // V3FWTkhFwELJm3ZbCoBIa/15n8G9bW1qyVJzEw16UM0x
// SIG // ghmfMIIZmwIBATCBlTB+MQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBTaWduaW5n
// SIG // IFBDQSAyMDExAhMzAAADri01UchTj1UdAAAAAAOuMA0G
// SIG // CWCGSAFlAwQCAQUAoIGuMBkGCSqGSIb3DQEJAzEMBgor
// SIG // BgEEAYI3AgEEMBwGCisGAQQBgjcCAQsxDjAMBgorBgEE
// SIG // AYI3AgEVMC8GCSqGSIb3DQEJBDEiBCC5C4nrnPBSgUTp
// SIG // BwqFWrZEPsqS7O1j6KLpQJQrwDnXZzBCBgorBgEEAYI3
// SIG // AgEMMTQwMqAUgBIATQBpAGMAcgBvAHMAbwBmAHShGoAY
// SIG // aHR0cDovL3d3dy5taWNyb3NvZnQuY29tMA0GCSqGSIb3
// SIG // DQEBAQUABIIBAFV5yRFSxwKieORw1RKtzgdZbHg5lMuv
// SIG // IvSGPYJN+isSOAwKoRMJ8V11TVNVytMUfROvDU12JORn
// SIG // DfjoVfWW9Tga/FGtiiBoZfufL0HJDiaH9xsOmjtNdlJ1
// SIG // jOSHzVTxa7VRwxjB+Fw7jrHekmGaYe9fFiaCCcI78ftX
// SIG // IBujBeKCXgCAB+pTHC461/Jn58iAIW4/AfkiL2EfEY2y
// SIG // TjEhEClj8jXMJysHP9fcLCKOlWdrdPK/mwEg+1VkKp0e
// SIG // 6vTHiZJnWQwWuy/ddjmaWQrIwEcjQo6PhvbyPW23d7g0
// SIG // YyMWeguXcvowa+WfR8mbCHONuOaKWLQU36O1gIgSR9v9
// SIG // clGhghcpMIIXJQYKKwYBBAGCNwMDATGCFxUwghcRBgkq
// SIG // hkiG9w0BBwKgghcCMIIW/gIBAzEPMA0GCWCGSAFlAwQC
// SIG // AQUAMIIBWQYLKoZIhvcNAQkQAQSgggFIBIIBRDCCAUAC
// SIG // AQEGCisGAQQBhFkKAwEwMTANBglghkgBZQMEAgEFAAQg
// SIG // MF69V7X1luULZFCJN8dh8Zn/n3pKkJhwAIEAdr8YxpoC
// SIG // BmYzojLRARgTMjAyNDA1MDgyMTE0MTUuODk2WjAEgAIB
// SIG // 9KCB2KSB1TCB0jELMAkGA1UEBhMCVVMxEzARBgNVBAgT
// SIG // Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
// SIG // BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEtMCsG
// SIG // A1UECxMkTWljcm9zb2Z0IElyZWxhbmQgT3BlcmF0aW9u
// SIG // cyBMaW1pdGVkMSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVT
// SIG // TjoyQUQ0LTRCOTItRkEwMTElMCMGA1UEAxMcTWljcm9z
// SIG // b2Z0IFRpbWUtU3RhbXAgU2VydmljZaCCEXgwggcnMIIF
// SIG // D6ADAgECAhMzAAAB3p5InpafKEQ9AAEAAAHeMA0GCSqG
// SIG // SIb3DQEBCwUAMHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAk
// SIG // BgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAy
// SIG // MDEwMB4XDTIzMTAxMjE5MDcxMloXDTI1MDExMDE5MDcx
// SIG // MlowgdIxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
// SIG // aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQK
// SIG // ExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xLTArBgNVBAsT
// SIG // JE1pY3Jvc29mdCBJcmVsYW5kIE9wZXJhdGlvbnMgTGlt
// SIG // aXRlZDEmMCQGA1UECxMdVGhhbGVzIFRTUyBFU046MkFE
// SIG // NC00QjkyLUZBMDExJTAjBgNVBAMTHE1pY3Jvc29mdCBU
// SIG // aW1lLVN0YW1wIFNlcnZpY2UwggIiMA0GCSqGSIb3DQEB
// SIG // AQUAA4ICDwAwggIKAoICAQC0gfQchfVCA4QOsRazp4sP
// SIG // 8bA5fLEovazgjl0kjuFTEI5zRgKOVR8dIoozBDB/S2Nk
// SIG // lCAZFUEtDJepEfk2oJFD22hKcI4UNZqa4UYCU/45Up4n
// SIG // ONlQwKNHp+CSOsZ16AKFqCskmPP0TiCnaaYYCOziW+Fx
// SIG // 5NT97F9qTWd9iw2NZLXIStf4Vsj5W5WlwB0btBN8p78K
// SIG // 0vP23KKwDTug47srMkvc1Jq/sNx9wBL0oLNkXri49qZA
// SIG // XH1tVDwhbnS3eyD2dkQuKHUHBD52Ndo8qWD50usmQLNK
// SIG // S6atCkRVMgdcesejlO97LnYhzjdephNJeiy0/TphqNEv
// SIG // eAcYNzf92hOn1G51aHplXOxZBS7pvCpGXG0O3Dh0gFhi
// SIG // cXQr6OTrVLUXUqn/ORZJQlyCJIOLJu5zPU5LVFXztJKe
// SIG // pMe5srIA9EK8cev+aGqp8Dk1izcyvgQotRu51A9abXrl
// SIG // 70KfHxNSqU45xv9TiXnocCjTT4xrffFdAZqIGU3t0sQZ
// SIG // DnjkMiwPvuR8oPy+vKXvg62aGT1yWhlP4gYhZi/rpfzo
// SIG // t3fN8ywB5R0Jh/1RjQX0cD/osb6ocpPxHm8Ll1SWPq08
// SIG // n20X7ofZ9AGjIYTccYOrRismUuBABIg8axfZgGRMvHvK
// SIG // 3+nZSiF+Xd2kC6PXw3WtWUzsPlwHAL49vzdwy1RmZR5x
// SIG // 5QIDAQABo4IBSTCCAUUwHQYDVR0OBBYEFGswJm8bHmmq
// SIG // YHccyvDrPp2j0BLIMB8GA1UdIwQYMBaAFJ+nFV0AXmJd
// SIG // g/Tl0mWnG1M1GelyMF8GA1UdHwRYMFYwVKBSoFCGTmh0
// SIG // dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2lvcHMvY3Js
// SIG // L01pY3Jvc29mdCUyMFRpbWUtU3RhbXAlMjBQQ0ElMjAy
// SIG // MDEwKDEpLmNybDBsBggrBgEFBQcBAQRgMF4wXAYIKwYB
// SIG // BQUHMAKGUGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9w
// SIG // a2lvcHMvY2VydHMvTWljcm9zb2Z0JTIwVGltZS1TdGFt
// SIG // cCUyMFBDQSUyMDIwMTAoMSkuY3J0MAwGA1UdEwEB/wQC
// SIG // MAAwFgYDVR0lAQH/BAwwCgYIKwYBBQUHAwgwDgYDVR0P
// SIG // AQH/BAQDAgeAMA0GCSqGSIb3DQEBCwUAA4ICAQDilMB7
// SIG // Fw2nBjr1CILORw4D7NC2dash0ugusHypS2g9+rWX21rd
// SIG // cfhjIms0rsvhrMYlR85ITFvhaivIK7i0Fjf7Dgl/nxlI
// SIG // E/S09tXESKXGY+P2RSL8LZAXLAs9VxFLF2DkiVD4rWOx
// SIG // PG25XZpoWGdvafl0KSHLBv6vmI5KgVvZsNK7tTH8TE0L
// SIG // PTEw4g9vIAFRqzwNzcpIkgob3aku1V/vy3BM/VG87aP8
// SIG // NvFgPBzgh6gU2w0R5oj+zCI/kkJiPVSGsmLCBkY73pZj
// SIG // WtDr21PQiUs/zXzBIH9jRzGVGFvCqlhIyIz3xyCsVpTT
// SIG // GIbln1kUh2QisiADQNGiS+LKB0Lc82djJzX42GPOdcB2
// SIG // IxoMFI/4ZS0YEDuUt9Gce/BqgSn8paduWjlif6j4Qvg1
// SIG // zNoF2oyF25fo6RnFQDcLRRbowiUXWW3h9UfkONRY4AYO
// SIG // JtzkxQxqLeQ0rlZEII5Lu6TlT7ZXROOkJQ4P9loT6U0M
// SIG // Vx+uLD9Rn5AMFLbeq62TPzwsERuoIq2Jp00Sy7InAYaG
// SIG // C4fhBBY1b4lwBk5OqZ7vI8f+Fj1rtI7M+8hc4PNvxTKg
// SIG // pPcCty78iwMgxzfhcWxwMbYMGne6C0DzNFhhEXQdbpjw
// SIG // iImLEn/4+/RKh3aDcEGETlZvmV9dEV95+m0ZgJ7JHjYY
// SIG // tMJ1WnlaICzHRg/p6jCCB3EwggVZoAMCAQICEzMAAAAV
// SIG // xedrngKbSZkAAAAAABUwDQYJKoZIhvcNAQELBQAwgYgx
// SIG // CzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9u
// SIG // MRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNy
// SIG // b3NvZnQgQ29ycG9yYXRpb24xMjAwBgNVBAMTKU1pY3Jv
// SIG // c29mdCBSb290IENlcnRpZmljYXRlIEF1dGhvcml0eSAy
// SIG // MDEwMB4XDTIxMDkzMDE4MjIyNVoXDTMwMDkzMDE4MzIy
// SIG // NVowfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
// SIG // bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoT
// SIG // FU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMd
// SIG // TWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwggIi
// SIG // MA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQDk4aZM
// SIG // 57RyIQt5osvXJHm9DtWC0/3unAcH0qlsTnXIyjVX9gF/
// SIG // bErg4r25PhdgM/9cT8dm95VTcVrifkpa/rg2Z4VGIwy1
// SIG // jRPPdzLAEBjoYH1qUoNEt6aORmsHFPPFdvWGUNzBRMhx
// SIG // XFExN6AKOG6N7dcP2CZTfDlhAnrEqv1yaa8dq6z2Nr41
// SIG // JmTamDu6GnszrYBbfowQHJ1S/rboYiXcag/PXfT+jlPP
// SIG // 1uyFVk3v3byNpOORj7I5LFGc6XBpDco2LXCOMcg1KL3j
// SIG // tIckw+DJj361VI/c+gVVmG1oO5pGve2krnopN6zL64NF
// SIG // 50ZuyjLVwIYwXE8s4mKyzbnijYjklqwBSru+cakXW2dg
// SIG // 3viSkR4dPf0gz3N9QZpGdc3EXzTdEonW/aUgfX782Z5F
// SIG // 37ZyL9t9X4C626p+Nuw2TPYrbqgSUei/BQOj0XOmTTd0
// SIG // lBw0gg/wEPK3Rxjtp+iZfD9M269ewvPV2HM9Q07BMzlM
// SIG // jgK8QmguEOqEUUbi0b1qGFphAXPKZ6Je1yh2AuIzGHLX
// SIG // pyDwwvoSCtdjbwzJNmSLW6CmgyFdXzB0kZSU2LlQ+QuJ
// SIG // YfM2BjUYhEfb3BvR/bLUHMVr9lxSUV0S2yW6r1AFemzF
// SIG // ER1y7435UsSFF5PAPBXbGjfHCBUYP3irRbb1Hode2o+e
// SIG // FnJpxq57t7c+auIurQIDAQABo4IB3TCCAdkwEgYJKwYB
// SIG // BAGCNxUBBAUCAwEAATAjBgkrBgEEAYI3FQIEFgQUKqdS
// SIG // /mTEmr6CkTxGNSnPEP8vBO4wHQYDVR0OBBYEFJ+nFV0A
// SIG // XmJdg/Tl0mWnG1M1GelyMFwGA1UdIARVMFMwUQYMKwYB
// SIG // BAGCN0yDfQEBMEEwPwYIKwYBBQUHAgEWM2h0dHA6Ly93
// SIG // d3cubWljcm9zb2Z0LmNvbS9wa2lvcHMvRG9jcy9SZXBv
// SIG // c2l0b3J5Lmh0bTATBgNVHSUEDDAKBggrBgEFBQcDCDAZ
// SIG // BgkrBgEEAYI3FAIEDB4KAFMAdQBiAEMAQTALBgNVHQ8E
// SIG // BAMCAYYwDwYDVR0TAQH/BAUwAwEB/zAfBgNVHSMEGDAW
// SIG // gBTV9lbLj+iiXGJo0T2UkFvXzpoYxDBWBgNVHR8ETzBN
// SIG // MEugSaBHhkVodHRwOi8vY3JsLm1pY3Jvc29mdC5jb20v
// SIG // cGtpL2NybC9wcm9kdWN0cy9NaWNSb29DZXJBdXRfMjAx
// SIG // MC0wNi0yMy5jcmwwWgYIKwYBBQUHAQEETjBMMEoGCCsG
// SIG // AQUFBzAChj5odHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20v
// SIG // cGtpL2NlcnRzL01pY1Jvb0NlckF1dF8yMDEwLTA2LTIz
// SIG // LmNydDANBgkqhkiG9w0BAQsFAAOCAgEAnVV9/Cqt4Swf
// SIG // ZwExJFvhnnJL/Klv6lwUtj5OR2R4sQaTlz0xM7U518Jx
// SIG // Nj/aZGx80HU5bbsPMeTCj/ts0aGUGCLu6WZnOlNN3Zi6
// SIG // th542DYunKmCVgADsAW+iehp4LoJ7nvfam++Kctu2D9I
// SIG // dQHZGN5tggz1bSNU5HhTdSRXud2f8449xvNo32X2pFaq
// SIG // 95W2KFUn0CS9QKC/GbYSEhFdPSfgQJY4rPf5KYnDvBew
// SIG // VIVCs/wMnosZiefwC2qBwoEZQhlSdYo2wh3DYXMuLGt7
// SIG // bj8sCXgU6ZGyqVvfSaN0DLzskYDSPeZKPmY7T7uG+jIa
// SIG // 2Zb0j/aRAfbOxnT99kxybxCrdTDFNLB62FD+CljdQDzH
// SIG // VG2dY3RILLFORy3BFARxv2T5JL5zbcqOCb2zAVdJVGTZ
// SIG // c9d/HltEAY5aGZFrDZ+kKNxnGSgkujhLmm77IVRrakUR
// SIG // R6nxt67I6IleT53S0Ex2tVdUCbFpAUR+fKFhbHP+Crvs
// SIG // QWY9af3LwUFJfn6Tvsv4O+S3Fb+0zj6lMVGEvL8CwYKi
// SIG // excdFYmNcP7ntdAoGokLjzbaukz5m/8K6TT4JDVnK+AN
// SIG // uOaMmdbhIurwJ0I9JZTmdHRbatGePu1+oDEzfbzL6Xu/
// SIG // OHBE0ZDxyKs6ijoIYn/ZcGNTTY3ugm2lBRDBcQZqELQd
// SIG // VTNYs6FwZvKhggLUMIICPQIBATCCAQChgdikgdUwgdIx
// SIG // CzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9u
// SIG // MRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNy
// SIG // b3NvZnQgQ29ycG9yYXRpb24xLTArBgNVBAsTJE1pY3Jv
// SIG // c29mdCBJcmVsYW5kIE9wZXJhdGlvbnMgTGltaXRlZDEm
// SIG // MCQGA1UECxMdVGhhbGVzIFRTUyBFU046MkFENC00Qjky
// SIG // LUZBMDExJTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0
// SIG // YW1wIFNlcnZpY2WiIwoBATAHBgUrDgMCGgMVAGigUorM
// SIG // uMvOqZfF8ttgiWRMRNrzoIGDMIGApH4wfDELMAkGA1UE
// SIG // BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRp
// SIG // bWUtU3RhbXAgUENBIDIwMTAwDQYJKoZIhvcNAQEFBQAC
// SIG // BQDp5gjkMCIYDzIwMjQwNTA4MjIyMTI0WhgPMjAyNDA1
// SIG // MDkyMjIxMjRaMHQwOgYKKwYBBAGEWQoEATEsMCowCgIF
// SIG // AOnmCOQCAQAwBwIBAAICD9IwBwIBAAICEYcwCgIFAOnn
// SIG // WmQCAQAwNgYKKwYBBAGEWQoEAjEoMCYwDAYKKwYBBAGE
// SIG // WQoDAqAKMAgCAQACAwehIKEKMAgCAQACAwGGoDANBgkq
// SIG // hkiG9w0BAQUFAAOBgQAlyNudZyNOOliWCIBziAuheWwq
// SIG // g/A1fa9AWKMH2x3gd2wHfPXkIxcb/iCfkUCG44y822Oq
// SIG // q/lKO14P36Pfv7W7sCiyVLNItnEQXhYqH8GTSLwnhELk
// SIG // EWydY5eq6rFw9GnOukX7ho40lhQprO1k3XpcbApjVUL/
// SIG // fdfLWDjwnJJSSTGCBA0wggQJAgEBMIGTMHwxCzAJBgNV
// SIG // BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
// SIG // VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQg
// SIG // Q29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBU
// SIG // aW1lLVN0YW1wIFBDQSAyMDEwAhMzAAAB3p5InpafKEQ9
// SIG // AAEAAAHeMA0GCWCGSAFlAwQCAQUAoIIBSjAaBgkqhkiG
// SIG // 9w0BCQMxDQYLKoZIhvcNAQkQAQQwLwYJKoZIhvcNAQkE
// SIG // MSIEIEqFjYg1DlbRkOqamQE32TdFron+gB1+W7sWQ5DJ
// SIG // mvQNMIH6BgsqhkiG9w0BCRACLzGB6jCB5zCB5DCBvQQg
// SIG // jj4jnw3BXhAQSQJ/5gtzIK0+cP1Ns/NS2A+OB3N+HXsw
// SIG // gZgwgYCkfjB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMK
// SIG // V2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwG
// SIG // A1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYD
// SIG // VQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAx
// SIG // MAITMwAAAd6eSJ6WnyhEPQABAAAB3jAiBCCa/cfGLhVX
// SIG // 4GOlOsgg+RycaiV3/F1wDeAu1ExMv42tIDANBgkqhkiG
// SIG // 9w0BAQsFAASCAgAlQYt6bUUwPZsEqUOjzc2M9Er6IYOD
// SIG // dwUAfKL+SqSsf1TC+ZbCz+59GUv1LoUgZc+NGPfgYST9
// SIG // dXn1ovfR6NHu3VZ0o1qf4Tsg+t8VVT3OYshA90ziyS75
// SIG // 9LxH2H9xFC9YwmX0jtCXRAeyjfJVK43DdcXnbgUZVf/R
// SIG // pRiFtWPi/R+aT19TCYiuV2hkWgPrXRUiLY3EdxKDkl7d
// SIG // OzC4eewwRdqg8oEge7No5iBhvtBTrEeGd1IJZbDGzKGR
// SIG // 7ptAxhHcYY16+tlqfXKskisUd4Yjgi2BWY6cFwEcNQ7n
// SIG // +LSejuRaNegkvdQFkcWKBrbTeGGTFO81jA4qvjiEkjJi
// SIG // Sm1Gm0Kdl9hhBPNAoBEhLz4n9mAKnTttUmDwLzBI0Bmr
// SIG // tPLweF++cx2J82/bTIICeCY/L9pLy8GJJF9+lwu50KmW
// SIG // PNOgqvuYLl8Tb33/h8BabGJr8nAqtDZ5YFKpJcmbMANR
// SIG // l4dxc9fIUztII9h6M8HdAiULDxc/nHku+Dap+QTwRUo+
// SIG // JxSFrf3Rqrk382G4Og+Rx13T9xvohdoYhjyP1wX1+eSd
// SIG // 13JE2s9YdBBOxgvzq0JdMmuyjxBDVQqtXoOWCrbaIeAn
// SIG // +lxTp7lnZApj2ZMlScWLRgJBAi84C1pCZVKPVS6YWIx9
// SIG // pcb+ZLFGYQ/6EKzKvbPRyIe+Dq9VW3gSoSvzkQ==
// SIG // End signature block
