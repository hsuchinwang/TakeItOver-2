const User = require('../models/user')
const Map = require('../models/map')
const Country = require('../models/country')
const Setting = require('../models/setting')
const Question = require('../models/question')
const Feedback = require('../models/feedback')
// var superagent = require('superagent')
module.exports = (app) => {
  app.use((req, res, next) => {
     next()
  })
  app.get('/get_record', (req, res) => {
    Setting.find({}, (e, Setting) => {
      if (e) {
        console.log(e)
      } else {
        var data = {}
        data.day1_resource = Setting[0].day1_resource
        data.day1_pizzle = Setting[0].day1_pizzle
        data.day3_land = Setting[0].day3_land
        data.day3_resource = Setting[0].day3_resource
        res.send(data)
        res.end()
      }
    })
  })
  app.get('/check_login', (req, res) => {
    if (req.session.username) {
        User.find({name: req.session.username}, (e, user) => {
          res.send({loggedIn: true, user})
        })
    } else {
        res.send({loggedIn: false})
    }
  })
  app.get('/manager_check_login', (req, res) => {
    if (req.session.manager_username) {
        res.send({
            need_login: false
        })
    } else {
        res.send({
            need_login: true
        })
    }
  })
  app.post('/login', (req, res) => {
    User.find({
      name: req.body.username,
      password: req.body.password
    },
      (e, user) => {
      if (e) {
        console.log(e)
        res.send({loggedIn: false})
        res.end()
      } else {
        if (user.length === 0) {
          res.send({loggedIn: false})
          res.end()
        } else {
          req.session.username = req.body.username
          res.send({loggedIn: true, user})
          res.end()
        }
      }
    })
    // if (req.body.username === 'A' && req.body.password === 'A') {
    //   req.session.username = req.body.username
    //   res.send({loggedIn: true})
    //   res.end()
    // } else {
    //   res.send({loggedIn: false})
    //   res.end()
    // }
  })
  app.get('/logout', (req, res) => {
    // clear the remember me cookie when logging out
    req.session.destroy()
    res.end()
  })
  app.get('/manager_logout', (req, res) => {
    req.session.destroy()
    res.end()
  })
  app.post('/manager_login', (req, res) => {
    if (req.body.user.username === 'BYT100' && req.body.user.password === 'ilovejesus') {
      req.session.manager_username = req.body.user.username
      res.send({logined: true, invaild: false})
      res.end()
    } else {
      res.send({logined: false, invaild: true})
      res.end()
    }
  })
  app.get('/get_user', (req, res) => {
    User.find({}, (e, user) => {
      if (e) {
        console.log(e)
      } else {
        res.send(user)
        res.end()
      }
    })
  })
  app.get('/get_question', (req, res) => {
    Question.find({}, (e, question) => {
      if (e) {
        console.log(e)
      } else {
        res.send(question)
        res.end()
      }
    })
  })
  app.get('/get_feedback', (req, res) => {
    Feedback.find({}, (e, feedback) => {
      if (e) {
        console.log(e)
      } else {
        res.send(feedback)
        res.end()
      }
    })
  })
  app.get('/get_setting', (req, res) => {
    Setting.find({}, (e, settings) => {
      if (e) {
        console.log(e)
      } else {
        res.send(settings)
        res.end()
      }
    })
  })
  app.get('/get_map', (req, res) => {
    Map.find({}, (e, country) => {
      if (e) {
        console.log(e)
      } else {
        res.send(country)
        res.end()
      }
    })
  })
  app.post('/update_map', (req, res) => {
    Map.update(
      {
        map_name: req.body.map_name
      },
      {
      $set: {
        country: req.body.country
      }
    }, (e, user) => {
      if (e) {
        console.log(e)
      } else {
        res.end()
      }
    })
    Setting.update({}, {
        $push: {
            day3_land: '時間為：' + new Date() + ' /地圖名稱：' + req.body.map_name + ' /country:' + req.body.country
        }
    }, function(e, data) {
        console.log(data)
    })
  })
  app.get('/get_country', (req, res) => {
    Country.find({}, (e, country) => {
      if (e) {
        console.log(e)
      } else {
        res.send(country)
        res.end()
      }
    })
  })
  app.post('/update_country', (req, res) => {
    Country.update(
      {
        country: req.body.name
      },
      {
      $inc: {
        K: req.body.K,
        water: req.body.water,
        fire: req.body.fire,
        wood: req.body.wood,
        stone: req.body.stone,
        seed: req.body.seed
      }
    }, (e, user) => {
      if (e) {
        console.log(e)
      } else {
        res.end()
      }
    })
    Setting.update({}, {
        $push: {
            day3_resource: '時間為：' + new Date() + ' /國家：' + req.body.name + ' /K寶石:' + req.body.K + ' /水：' + req.body.water + ' /火：' + req.body.fire + ' /木頭：' + req.body.wood + ' /石頭：' + req.body.stone + ' /種子：' + req.body.seed
        }
    }, function(e, data) {
        console.log(data)
    })
  })
  app.post('/update_user_data', (req, res) => {
    User.update(
      {
        name: req.body.name
      },
      {
      $set: {
        P1: req.body.P1,
        P2: req.body.P2,
        P3: req.body.P3,
        P4: req.body.P4,
        P5: req.body.P5,
        P6: req.body.P6,
        P7: req.body.P7,
        P8: req.body.P8,
        P9: req.body.P9,
        P10: req.body.P10
      },
      $inc: {
        K: req.body.K,
        water: req.body.water,
        fire: req.body.fire,
        wood: req.body.wood,
        stone: req.body.stone,
        seed: req.body.seed
      }
    }, (e, user) => {
      if (e) {
        console.log(e)
      } else {
        res.end()
      }
    })
  })
  app.post('/update_user_pizzle', (req, res) => {
    User.update(
      {
        name: req.body.name
      },
      {
      $set: {
        P1: req.body.P1,
        P2: req.body.P2,
        P3: req.body.P3,
        P4: req.body.P4,
        P5: req.body.P5,
        P6: req.body.P6,
        P7: req.body.P7,
        P8: req.body.P8,
        P9: req.body.P9,
        P10: req.body.P10
      }
    }, (e, user) => {
      if (e) {
        console.log(e)
      } else {
        res.end()
      }
    })
    Setting.update({}, {
        $push: {
            day1_pizzle: '時間為：' + new Date() + ' /組別：' + req.body.name + ' /P1:' + req.body.P1 + ' /P2：' + req.body.P2 + ' /P3：' + req.body.P3 + ' /P4：' + req.body.P4 + ' /P5：' + req.body.P5 + ' /P6：' + req.body.P6 + ' /P7：' + req.body.P7 + ' /P8：' + req.body.P8 + ' /P9：' + req.body.P9 + ' /P10：' + req.body.P10
        }
    }, function(e, data) {
        console.log(data)
    })
  })
  app.post('/update_user_pizzle_single', (req, res) => {
    console.log(req.body)
    console.log(req.body.pizzle)
    console.log(req.body.pizzle_result)
    var pizzleUpdate = { $set: {} }
    pizzleUpdate.$set[req.body.pizzle] = req.body.pizzle_result
    User.update(
      {
        name: req.body.name
      },
      pizzleUpdate,
      (e, user) => {
      if (e) {
        console.log(e)
      } else {
        res.end()
      }
    })
    Setting.update({}, {
        $push: {
            day1_pizzle: '時間為：' + new Date() + ' /組別：' + req.body.name + ' /' + req.body.pizzle + ':' + req.body.pizzle_result
        }
    }, function(e, data) {
        console.log(data)
    })
  })
  app.post('/update_user_resource', (req, res) => {
    User.update(
      {
        name: req.body.name
      },
      {
      $inc: {
        K: req.body.K,
        water: req.body.water,
        fire: req.body.fire,
        wood: req.body.wood,
        stone: req.body.stone,
        seed: req.body.seed
      }
    }, (e, user) => {
      if (e) {
        console.log(e)
      } else {
        res.end()
      }
    })
    Country.update(
      {
        country: req.body.country
      },
      {
      $inc: {
        K: req.body.K,
        water: req.body.water,
        fire: req.body.fire,
        wood: req.body.wood,
        stone: req.body.stone,
        seed: req.body.seed
      }
    }, (e, user) => {
      if (e) {
        console.log(e)
      } else {
        res.end()
      }
    })
    Setting.update({}, {
        $push: {
            day1_resource: '時間為：' + new Date() + ' /組別：' + req.body.name + ' /K寶石:' + req.body.K + ' /水：' + req.body.water + ' /火：' + req.body.fire + ' /木頭：' + req.body.wood + ' /石頭：' + req.body.stone + ' /種子：' + req.body.seed
        }
    }, function(e, data) {
        console.log(data)
    })
  })
  app.post('/switchs_table', (req, res) => {
    Setting.update({},
      {
      $set: {
        changeToDay3: req.body.state
      }
    }, (e, user) => {
      if (e) {
        console.log(e)
      } else {
        res.end()
      }
    })
  })
  app.post('/reset_qrcode', (req, res) => {
    User.update(
    {},
    {
      $set: {
        R1: 'F',
        R2: 'F',
        R3: 'F',
        R4: 'F',
        R5: 'F',
        R6: 'F',
        R7: 'F',
        R8: 'F',
        R9: 'F',
        R10: 'F'
      }
    },
    {
      'multi': true
    },
    (e, user) => {
      if (e) {
        console.log(e)
      } else {
        res.end()
      }
    })
  })
  app.post('/update_reference', (req, res) => {
    Setting.update(
      {},
      {
      $set: {
        reference: req.body.reference
      }
    }, (e, user) => {
      if (e) {
        console.log(e)
      } else {
        res.end()
      }
    })
  })
  app.post('/update_board', (req, res) => {
    Setting.update(
      {},
      {
      $set: {
        board: req.body.board
      }
    }, (e, user) => {
      if (e) {
        console.log(e)
      } else {
        res.end()
      }
    })
  })
  // 注册
  app.post('/user/signup', (req, res) => {
    var _user = req.body
    console.log(_user)
    User.findOne({name: _user.name}, (err, user) => {
      if (err) {
        console.log(err)
      }
      if (user) {
        res.json({
          errno: 1,
          data: '用户名已存在'
        })
      } else {
        new User(_user).save((err, user) => {
          if (err) {
            console.log(err)
          }
          res.json({
            errno: 0,
            data: '注册成功'
          })
        })
      }
    })
  })
  // 登录
  app.post('/user/signin', (req, res) => {
    console.log(req.body)
    var _user = req.body
    var name = _user.name
    var password = _user.password
    console.log(password)
    User.findOne({name: name}, (err, user) => {
      if (err) {
        console.log(err)
      }
      console.log(user)
      if (!user) {
        res.json({
          errno: 1,
          data: '用户不存在'
        })
      } else {
        if (password) {
          user.comparePassword(password, (err, isMatch) => {
            if (err) {
              console.log(err)
            }
            if (isMatch) {
              req.session.user = user
              console.log('success')
              res.json({
                errno: 0,
                data: '登录成功',
                name: name,
                src: user.src
              })
            } else {
              res.json({
                errno: 1,
                data: '密码不正确'
              })
              console.log('password is not meached')
            }
          })
        } else {
          res.json({
            errno: 1,
            data: '登录失败'
          })
        }
      }
    })
  })
  // 信息
  app.get('/message', (req, res) => {
    Message.find({}, (err, message) => {
      if (err) {
        console.log(err)
      } else {
        res.json({
          errno: 0,
          data: message
        })
      }
    })
  })
  // 机器人消息
  // app.get('/robotapi', (req, res) => {
  //   var response = res
  //   var info = req.query.info
  //   var userid = req.query.id
  //   var key = 'fde7f8d0b3c9471cbf787ea0fb0ca043'
  //   superagent.post('http://www.tuling123.com/openapi/api')
  //     .send({info, userid, key})
  //     .end((err, res) => {
  //       if (err) {
  //         console.log(err)
  //       }
  //       response.json({
  //         data: res.text
  //       })
  //     })
  // })
}
