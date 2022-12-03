const { newEnforcer } = require('casbin')

async function start() {

}

async function verify(e, sub, obj, act) {
  if (await e.enforce(sub, obj, act) === true){
    console.log(`${sub} can ${act} ${obj}`)
  }else {
    console.log(`${sub} can't ${act} ${obj}`)
  }
}

start().then(async ()=>{
  const e = await newEnforcer('./model.conf', './policy.csv');

  let sub = 'alice'; // 想要访问资源的用户
  const obj = 'data1'; // 将要被访问的资源
  const act = 'read'; // 用户对资源进行的操作

  await verify(e, 'alice', 'data1', act);
  await verify(e, 'bob', 'data1', act);
  await verify(e, 'bob2', 'data1', act);
})