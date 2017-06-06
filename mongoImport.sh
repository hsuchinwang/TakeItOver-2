mongoimport --headerline -d takeitover -c maps --type csv --file ./csv/map.csv
mongoimport --headerline -d takeitover -c users --type csv --file ./csv/user.csv
mongoimport --headerline -d takeitover -c countries --type csv --file ./csv/country.csv
mongoimport --headerline -d takeitover -c qrcodes --type csv --file ./csv/qrcode.csv
mongoimport --headerline -d takeitover -c settings --type csv --file ./csv/setting.csv
mongoimport --headerline -d takeitover -c feedbacks --type csv --file ./csv/feedback.csv
mongoimport --headerline -d takeitover -c questions --type csv --file ./csv/question.csv