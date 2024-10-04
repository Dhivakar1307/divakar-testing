export function startSplitterResize(
    el,
    splitter,
    paneId,
    paneNextId,
    orientation,
    clientPos,
    minValue,
    maxValue,
    minNextValue,
    maxNextValue) {

    //var el = document.getElementById(id);
    var pane = document.getElementById(paneId);
    var paneNext = document.getElementById(paneNextId);
    var paneLength;
    var paneNextLength;
    var panePerc;
    var paneNextPerc;
    var isHOrientation = orientation == 'Horizontal';

    var totalLength = 0.0;
    Array.from(el.children).forEach(element => {
        totalLength += isHOrientation
            ? element.getBoundingClientRect().width
            : element.getBoundingClientRect().height;
    });

    if (pane) {
        paneLength = isHOrientation
            ? pane.getBoundingClientRect().width
            : pane.getBoundingClientRect().height;

        panePerc = (paneLength / totalLength * 100) + '%';
    }

    if (paneNext) {
        paneNextLength = isHOrientation
            ? paneNext.getBoundingClientRect().width
            : paneNext.getBoundingClientRect().height;

        paneNextPerc = (paneNextLength / totalLength * 100) + '%';
    }

    function ensurevalue(value) {
        if (!value)
            return null;

        value = value.trim().toLowerCase();

        if (value.endsWith("%"))
            return totalLength * parseFloat(value) / 100;

        if (value.endsWith("px"))
            return parseFloat(value);

        throw 'Invalid value';
    }

    minValue = ensurevalue(minValue);
    maxValue = ensurevalue(maxValue);
    minNextValue = ensurevalue(minNextValue);
    maxNextValue = ensurevalue(maxNextValue);

    if (!document.splitterData) {
        document.splitterData = {};
    }

    document.splitterData[el] = {
        clientPos: clientPos,
        panePerc: parseFloat(panePerc),
        paneNextPerc: isFinite(parseFloat(paneNextPerc)) ? parseFloat(paneNextPerc) : 0,
        paneLength: paneLength,
        paneNextLength: isFinite(paneNextLength) ? paneNextLength : 0,
        mouseUpHandler: function (e) {
            if (document.splitterData[el]) {
                splitter.invokeMethodAsync(
                    'FluentMultiSplitter.OnPaneResizedAsync',
                    parseInt(pane.getAttribute('data-index')),
                    parseFloat(pane.style.flexBasis),
                    paneNext ? parseInt(paneNext.getAttribute('data-index')) : null,
                    paneNext ? parseFloat(paneNext.style.flexBasis) : null
                );
                document.removeEventListener('mousemove', document.splitterData[el].mouseMoveHandler);
                document.removeEventListener('mouseup', document.splitterData[el].mouseUpHandler);
                document.removeEventListener('touchmove', document.splitterData[el].touchMoveHandler);
                document.removeEventListener('touchend', document.splitterData[el].mouseUpHandler);
                document.splitterData[el] = null;
            }
        },
        mouseMoveHandler: function (e) {
            if (document.splitterData[el]) {

                var spacePerc = document.splitterData[el].panePerc + document.splitterData[el].paneNextPerc;
                var spaceLength = document.splitterData[el].paneLength + document.splitterData[el].paneNextLength;

                var length = (document.splitterData[el].paneLength -
                    (document.splitterData[el].clientPos - (isHOrientation ? e.clientX : e.clientY)));

                if (length > spaceLength)
                    length = spaceLength;

                if (minValue && length < minValue) length = minValue;
                if (maxValue && length > maxValue) length = maxValue;

                if (paneNext) {
                    var nextSpace = spaceLength - length;
                    if (minNextValue && nextSpace < minNextValue) length = spaceLength - minNextValue;
                    if (maxNextValue && nextSpace > maxNextValue) length = spaceLength + maxNextValue;
                }

                var perc = length / document.splitterData[el].paneLength;
                if (!isFinite(perc)) {
                    perc = 1;
                    document.splitterData[el].panePerc = 0.1;
                    document.splitterData[el].paneLength = isHOrientation
                        ? pane.getBoundingClientRect().width
                        : pane.getBoundingClientRect().height;
                }

                var newPerc = document.splitterData[el].panePerc * perc;
                if (newPerc < 0) newPerc = 0;
                if (newPerc > 100) newPerc = 100;

                pane.style.flexBasis = newPerc + '%';
                if (paneNext)
                    paneNext.style.flexBasis = (spacePerc - newPerc) + '%';
            }
        },
        touchMoveHandler: function (e) {
            if (e.targetTouches[0]) {
                document.splitterData[el].mouseMoveHandler(e.targetTouches[0]);
            }
        }
    };
    document.addEventListener('mousemove', document.splitterData[el].mouseMoveHandler);
    document.addEventListener('mouseup', document.splitterData[el].mouseUpHandler);
    document.addEventListener('touchmove', document.splitterData[el].touchMoveHandler, { passive: true });
    document.addEventListener('touchend', document.splitterData[el].mouseUpHandler, { passive: true });
}

// SIG // Begin signature block
// SIG // MIInzAYJKoZIhvcNAQcCoIInvTCCJ7kCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // SQrUGIZO8y8LN8e5WjaqN1ZjBNOngpNl2oawWqX9TJOg
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
// SIG // AYI3AgEVMC8GCSqGSIb3DQEJBDEiBCCtfQdgwcR5WWCL
// SIG // iuvPz9aQZdUJWRE0L398RD84VXdCnDBCBgorBgEEAYI3
// SIG // AgEMMTQwMqAUgBIATQBpAGMAcgBvAHMAbwBmAHShGoAY
// SIG // aHR0cDovL3d3dy5taWNyb3NvZnQuY29tMA0GCSqGSIb3
// SIG // DQEBAQUABIIBANQ6ltnMQ8+ZQ3bEIdA4Fvv/NRVyE+Hg
// SIG // 93FE4oNnA9rDLY90R0pEcx3xKmghHjrxaFwjTf4fEeBg
// SIG // rzGLrNz27c5uaDR1ffDb2k+/mv92smgjmmaldPGS/L0m
// SIG // i86FeM4JNY6IV0MvtddB6uwhh5/BLTZn6Dc1FaBuH4MT
// SIG // kJwquwZP3vxld62miLbd1C/cQU+mwc38fmO5J+QEb7LO
// SIG // 9/dyKrFIcQS+8+VVk086qdbls35LXLnBwqRN1skClNep
// SIG // IAdrPOPCd5nufM2IyZVI0Ci2+47ouv6N+9d08Sd2pc5i
// SIG // KM8OJxU11weWIZisp/6UeOJFQ/KzoaQw2/a5/cwOZo7I
// SIG // hwahghcpMIIXJQYKKwYBBAGCNwMDATGCFxUwghcRBgkq
// SIG // hkiG9w0BBwKgghcCMIIW/gIBAzEPMA0GCWCGSAFlAwQC
// SIG // AQUAMIIBWQYLKoZIhvcNAQkQAQSgggFIBIIBRDCCAUAC
// SIG // AQEGCisGAQQBhFkKAwEwMTANBglghkgBZQMEAgEFAAQg
// SIG // /fpuDousnFDfDSPE0nMH6kXSGGYKQeLA5N+302qRUyMC
// SIG // BmYzqwj7JxgTMjAyNDA1MDgyMTE0MTYuMTI3WjAEgAIB
// SIG // 9KCB2KSB1TCB0jELMAkGA1UEBhMCVVMxEzARBgNVBAgT
// SIG // Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
// SIG // BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEtMCsG
// SIG // A1UECxMkTWljcm9zb2Z0IElyZWxhbmQgT3BlcmF0aW9u
// SIG // cyBMaW1pdGVkMSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVT
// SIG // Tjo4NkRGLTRCQkMtOTMzNTElMCMGA1UEAxMcTWljcm9z
// SIG // b2Z0IFRpbWUtU3RhbXAgU2VydmljZaCCEXgwggcnMIIF
// SIG // D6ADAgECAhMzAAAB3V1XHZXUraobAAEAAAHdMA0GCSqG
// SIG // SIb3DQEBCwUAMHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAk
// SIG // BgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAy
// SIG // MDEwMB4XDTIzMTAxMjE5MDcwOVoXDTI1MDExMDE5MDcw
// SIG // OVowgdIxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
// SIG // aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQK
// SIG // ExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xLTArBgNVBAsT
// SIG // JE1pY3Jvc29mdCBJcmVsYW5kIE9wZXJhdGlvbnMgTGlt
// SIG // aXRlZDEmMCQGA1UECxMdVGhhbGVzIFRTUyBFU046ODZE
// SIG // Ri00QkJDLTkzMzUxJTAjBgNVBAMTHE1pY3Jvc29mdCBU
// SIG // aW1lLVN0YW1wIFNlcnZpY2UwggIiMA0GCSqGSIb3DQEB
// SIG // AQUAA4ICDwAwggIKAoICAQCoTgOUROoud5x1ER+JZ3yi
// SIG // 6fvSb4qbk7XLWoqwsTFEqz0suQlitg7a4kD/k+dh12zd
// SIG // oOwJLUNaUGW0wxhcyundN72GDawj7iSvj0bD9hT1Q4wV
// SIG // 8uZqy0RcyBxy2ogGqGxObxSbqMWdGVnSjArPGnI4R1Jn
// SIG // 2mPu/fwke7jfgePsYyasL3aVP5qdJgKt3mq8h/gCpr+p
// SIG // ZK0DfM4K3GwoB8LKr76k+pRBamKYu7ip+zAGG0ni3tKT
// SIG // HWrVeRFujVZ1zGDk0Srhj38nwSnUobmpS6PPJBu6mtpm
// SIG // wOZe+/l9OiQHrDJKMmK+P/QoAxYx1KXB0jg7o5RQSjIt
// SIG // evM0XS3q3aVtGwV/RA7sdswTDGhCvDcsWsAhLgKu/vu5
// SIG // LRQG5d4VCrbs2AtRVGblJdgaulNe0uAirKkd4rS0/ajX
// SIG // G9qQCeI6yA3ZZeU4KKnn+YKb/mHLwTPN+G1xTcMrXd7o
// SIG // ww9uD/Q3fMX1Sb7po7AUEJCuU/6stx60CfLndZx0r7RV
// SIG // YuUmv7mxrmBKUvIBehg1jefym73hZHbKE1SD6PKZFoYz
// SIG // 7NEO5wOfrgcUAeM5YxIys+VluwQOMKZhZtuH4QZkY1eD
// SIG // W6fp+/HIAI7w0n05QOg2AXL9pMdSR9nSIWkZ0njl3j0+
// SIG // oTBdCJeffCzLtK8N+VYlFnAEJFDVE8UZ6hhcc+cPmbrD
// SIG // AwIDAQABo4IBSTCCAUUwHQYDVR0OBBYEFG6i9baMj1Ha
// SIG // Rcsh0gylo9COJcPxMB8GA1UdIwQYMBaAFJ+nFV0AXmJd
// SIG // g/Tl0mWnG1M1GelyMF8GA1UdHwRYMFYwVKBSoFCGTmh0
// SIG // dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2lvcHMvY3Js
// SIG // L01pY3Jvc29mdCUyMFRpbWUtU3RhbXAlMjBQQ0ElMjAy
// SIG // MDEwKDEpLmNybDBsBggrBgEFBQcBAQRgMF4wXAYIKwYB
// SIG // BQUHMAKGUGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9w
// SIG // a2lvcHMvY2VydHMvTWljcm9zb2Z0JTIwVGltZS1TdGFt
// SIG // cCUyMFBDQSUyMDIwMTAoMSkuY3J0MAwGA1UdEwEB/wQC
// SIG // MAAwFgYDVR0lAQH/BAwwCgYIKwYBBQUHAwgwDgYDVR0P
// SIG // AQH/BAQDAgeAMA0GCSqGSIb3DQEBCwUAA4ICAQAuVNmy
// SIG // DS4FyB1mzHKlbn/Y5FE/yvM8iwb7uYfCa6mEds/3mjts
// SIG // qNTqHPUocr8W3vRmQ7u5JFM8UsidSGZLGWcOhQ6usmTU
// SIG // 9zxIwBJ0RKUQS/Evpm14PjuFS0tC0pm/FyGYi7GqmdHw
// SIG // xHL9x3gPv8v6ipwkFpF4IaWhDMBjEM0ZIRsHBnV69cxq
// SIG // UOx08b37ue8RcWV9TJCp1hRDSerq3fuLXlIF49J4CDsf
// SIG // /5d1zCtx7fE9vs7xiTQBfuf+agZO569O/cyAmxV78bYn
// SIG // TTeXqF3VvvawCJEvlBg9fQGXQa7benWfjnQKrgYg5GEO
// SIG // ZFX1DCkt9ch0DhoJhcbgjs06Vh2pa6qXSJZbMvCjbI+V
// SIG // PbDjYlgHfTzZchBx20GQ5ovfwTZTmMk7dGHoS2w6L5mV
// SIG // DWs5O/TnfwPde5qgnU6qxMcARlD2zD/v73WFKmibKbqQ
// SIG // Z1LYzn/++gwIVcvHv3us0ffD5KZZpYjtm6y90N6w+vmQ
// SIG // lXaxjPUZuoVAwQZL2IfmI5hnXEORwelk/UXnPPqgx5m4
// SIG // S4V+GXWmq3efzl3i24Mdn+y+EEEI9yoKo6gzliJ1YTRN
// SIG // YGLU1ix3uPPNnf5Oy7otCtYPBGayg+5mjq7CSyjypXoH
// SIG // HifRQqmNbA1ClIUWtBB1FvmZCi5aISq0uxcI3ayDVpDw
// SIG // YG0M5wo3RNpuO0I02zCCB3EwggVZoAMCAQICEzMAAAAV
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
// SIG // MCQGA1UECxMdVGhhbGVzIFRTUyBFU046ODZERi00QkJD
// SIG // LTkzMzUxJTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0
// SIG // YW1wIFNlcnZpY2WiIwoBATAHBgUrDgMCGgMVADYjRxll
// SIG // 2zWgz8Z8og2xDnIkoxYQoIGDMIGApH4wfDELMAkGA1UE
// SIG // BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRp
// SIG // bWUtU3RhbXAgUENBIDIwMTAwDQYJKoZIhvcNAQEFBQAC
// SIG // BQDp5hHxMCIYDzIwMjQwNTA4MjMwMDAxWhgPMjAyNDA1
// SIG // MDkyMzAwMDFaMHQwOgYKKwYBBAGEWQoEATEsMCowCgIF
// SIG // AOnmEfECAQAwBwIBAAICFuUwBwIBAAICFBEwCgIFAOnn
// SIG // Y3ECAQAwNgYKKwYBBAGEWQoEAjEoMCYwDAYKKwYBBAGE
// SIG // WQoDAqAKMAgCAQACAwehIKEKMAgCAQACAwGGoDANBgkq
// SIG // hkiG9w0BAQUFAAOBgQCv0CrppvTymcpMNT6JX+JQBt2c
// SIG // yQThn/tmV5/ZoMmheicBuMIOrtZmSQVWWloK6mVZxpoz
// SIG // NjPzaKzdm7jKrODAN35XKBav4wf7dCvlME2UdOVRBD8K
// SIG // 3xYC0WraGG6XYW2T+ftVshicKMB/eUZJfUJsGgR3MZ/X
// SIG // wT3U6+1B6A/2STGCBA0wggQJAgEBMIGTMHwxCzAJBgNV
// SIG // BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
// SIG // VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQg
// SIG // Q29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBU
// SIG // aW1lLVN0YW1wIFBDQSAyMDEwAhMzAAAB3V1XHZXUraob
// SIG // AAEAAAHdMA0GCWCGSAFlAwQCAQUAoIIBSjAaBgkqhkiG
// SIG // 9w0BCQMxDQYLKoZIhvcNAQkQAQQwLwYJKoZIhvcNAQkE
// SIG // MSIEIJ3gcgw0/ahBPKAXPAHbh4dXw2rfbV+tIHSdSwcL
// SIG // +TlvMIH6BgsqhkiG9w0BCRACLzGB6jCB5zCB5DCBvQQg
// SIG // Yf8OLZplrE94mZx7R9FZN+1AjdNpUcWPkYjjesAxY2Yw
// SIG // gZgwgYCkfjB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMK
// SIG // V2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwG
// SIG // A1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYD
// SIG // VQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAx
// SIG // MAITMwAAAd1dVx2V1K2qGwABAAAB3TAiBCDQCljlQPj+
// SIG // lF95Jt7DHwb/2U/ZY3BnSiNq/vxbXGGxBjANBgkqhkiG
// SIG // 9w0BAQsFAASCAgAGqvl/nm7bDQkf6UbHlg3ywulARZtX
// SIG // szmKSYNQv2LN4yll+t9HjKqSKBwQdckCcYEUz8EARKQR
// SIG // YqnZKDe1IPEegT6JSTlnSDWsU2Q99TsmavDzI0iCLJN4
// SIG // c5BY7hUv1MTkL0pr7Gnm4IfGTifSvn7D7IxmrNTZCF0W
// SIG // x8On2+tn6J6nKN9z4sh4QXTkKbNVa2kA7bDMEbcHnUoc
// SIG // uEdVg6PwW57VSNRKgTY3slQ2UhZYjob8wpkYMLMoKwuw
// SIG // NhBr+vMRRBRpqxvmOUV10YAqzRWfu/l1/aEpJaSgIU68
// SIG // RQWklM3wJu69fg6RLf7PTEGwkBGJis69KSnDjVR22wR9
// SIG // DcfgprNcVYGKTnOCgN29Rv6ffhOGOedEkp+b54gdHtyh
// SIG // RkeM2C/xCvMjPyCSNGLMIOPT0oCbmTEw8Hv7B/H3x5AU
// SIG // ej/bu0pDPXaC3Qo0EG5IyBNM+WbtgFu8h+OB9yL7kVW+
// SIG // /SEQIgJJcXblDKaAE45LuktoW0kJqnIHhHksTMx7T1lj
// SIG // 1Mqvnikl8r3nKhO5DpuvnH58SamqMnq0hTrqP4u8aGzX
// SIG // 1kg8/R405TRcWtv7CULdASY2MOsYBdojb/b8Buwlunz8
// SIG // NNguuINjlvCVpPUWvCRBsUimMzEfNQ7JwtMPvohUrJFn
// SIG // TFz+6XvmYl4FXvopo4rKXLho3OVXj/pZPxAA2g==
// SIG // End signature block
