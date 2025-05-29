postman work
curl -X 'POST' \
'http://127.0.0.1:8095/api/v1/commands/chat' \
-H 'accept: application/json' \
-H 'Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsInNjb3BlIjoiIiwidGVuYW50SWQiOiJkZmQyNTcyMC1hMzU2LTRiZDQtYmU2MC04M2E2MGExODM4MTAiLCJpc0FkbWluIjpmYWxzZSwiZXhwIjoxNzQ4NjAyNTIyLCJpYXQiOjE3NDg1MTYxMjIsInVzZXJJZCI6ImE3MDg3MjI2LTg5NDItNDJjMy1hYjg1LTkzZmQ5NmExZGRhYiJ9.CkPB4gyPL3QixbIAIHSpSon743EVepmTtTA3h0RGCim8YHevq9niy7_KUjb9aCYz77xfKlYnQImKwbUJOIEKBA' \
-H 'Content-Type: multipart/form-data' \
-F 'files=@CV_PAPA_COUNDIA_JAVA_FR.pdf;type=application/pdf' \
-F 'files=@CV_PAPA_COUNDIA_JAVA_REACT.pdf;type=application/pdf' \
-F 'messages=q' \
-F 'responsesJson=q' \
-F 'responses=q' \
-F 'state=qs' \
-F 'account=s' \
-F 'updatedAt=' \
-F 'reference='
angular  not work
curl 'http://127.0.0.1:8095/api/v1/commands/chat' \
-H 'Accept: application/json, text/plain, */*' \
-H 'Accept-Language: en-US,en;q=0.9,fr-FR;q=0.8,fr;q=0.7' \
-H 'Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsInNjb3BlIjoiIiwidGVuYW50SWQiOiJkZmQyNTcyMC1hMzU2LTRiZDQtYmU2MC04M2E2MGExODM4MTAiLCJpc0FkbWluIjpmYWxzZSwiZXhwIjoxNzQ4NTk2MjQxLCJpYXQiOjE3NDg1MDk4NDEsInVzZXJJZCI6ImE3MDg3MjI2LTg5NDItNDJjMy1hYjg1LTkzZmQ5NmExZGRhYiJ9.5jMTqoh2grSjYKlvILWs9BwW4_6-MqUVjzPHn_IzTJ_F_5iUJB1C2p1RGstbYkFrhGRT5AV1FwI5wwE84x1nww' \
-H 'Cache-Control: no-cache' \
-H 'Connection: keep-alive' \
-H 'Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryAUTDwpep30v6BZfh' \
-H 'Origin: http://localhost:4200' \
-H 'Pragma: no-cache' \
-H 'Referer: http://localhost:4200/' \
-H 'Sec-Fetch-Dest: empty' \
-H 'Sec-Fetch-Mode: cors' \
-H 'Sec-Fetch-Site: cross-site' \
-H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36' \
-H 'sec-ch-ua: "Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"' \
-H 'sec-ch-ua-mobile: ?0' \
-H 'sec-ch-ua-platform: "macOS"' \
--data-raw $'------WebKitFormBoundaryAUTDwpep30v6BZfh\r\nContent-Disposition: form-data; name="files"; filename="CV_PAPA_COUNDIA_JAVA_FR.pdf"\r\nContent-Type: application/pdf\r\n\r\n\r\n------WebKitFormBoundaryAUTDwpep30v6BZfh\r\nContent-Disposition: form-data; name="files"; filename="CV_PAPA_COUNDIA_JAVA_PHP.pdf"\r\nContent-Type: application/pdf\r\n\r\n\r\n------WebKitFormBoundaryAUTDwpep30v6BZfh\r\nContent-Disposition: form-data; name="files"; filename="CV_PAPA_COUNDIA_JAVA_REACT.pdf"\r\nContent-Type: application/pdf\r\n\r\n\r\n------WebKitFormBoundaryAUTDwpep30v6BZfh\r\nContent-Disposition: form-data; name="messages"\r\n\r\na\r\n------WebKitFormBoundaryAUTDwpep30v6BZfh\r\nContent-Disposition: form-data; name="responsesJson"\r\n\r\na\r\n------WebKitFormBoundaryAUTDwpep30v6BZfh\r\nContent-Disposition: form-data; name="responses"\r\n\r\na\r\n------WebKitFormBoundaryAUTDwpep30v6BZfh\r\nContent-Disposition: form-data; name="state"
\r\n\r\na\r\n------WebKitFormBoundaryAUTDwpep30v6BZfh\r\nContent-Disposition: form-data; name="account"\r\n\r\na\r\n------WebKitFormBoundaryAUTDwpep30v6BZfh\r\nContent-Disposition: form-data; name="updatedAt"\r\n\r\n2025-05-29T11:04:30.046Z\r\n------WebKitFormBoundaryAUTDwpep30v6BZfh\r\nContent-Disposition: form-data; name="reference"\r\n\r\na\r\n------WebKitFormBoundaryAUTDwpep30v6BZfh--\r\n'
