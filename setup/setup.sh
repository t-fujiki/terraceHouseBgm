mongo
use terrace

mongo paulo.mongohq.com:10043/app17861801 -u t-fujiki -p

db.videos.update({_id:ObjectId("52236915a445eaae398d06d5")},{$set: {vid: "sHFDBP9VDAg" }});


■Step from scratch

yo express
npm install mongoose --save

bower install angular --save
bower install jquery --save


