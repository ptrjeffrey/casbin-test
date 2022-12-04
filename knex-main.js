const { newEnforcer, Model, StringAdapter } = require('casbin')
const Knex = require('knex')
const casbin = require('casbin');
const { KnexAdapter } = require('casbin-knex-adapter');

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
 const m= new Model();
  m.loadModelFromText(`
# Request definition
[request_definition]
r = sub, obj, act

# Policy definition
[policy_definition]
p = sub, obj, act

# Policy effect
[policy_effect]
e = some(where (p.eft == allow))

# Matchers
[matchers]
m = r.sub == p.sub && r.obj == p.obj && r.act == p.act



[role_definition]
g = _, _
`)

  const knex = require('knex')({
    client: 'pg',
    connection: {
      host : '192.168.40.129',
      port : 5432,
      user : 'postgres',
      password : 'mysecretpassword',
      database : 'casbin'
    }
  });

  const adapter = await KnexAdapter.newAdapter(knex, {tableName: 'casbin_rule'});
  const e = await newEnforcer(m, adapter);

  await e.loadPolicy();
  let sub = 'alice'; // 想要访问资源的用户
  const obj = 'data1'; // 将要被访问的资源
  const act = 'read'; // 用户对资源进行的操作

  await verify(e, 'alice', 'data1', act);
  await verify(e, 'bob', 'data1', act);
  await verify(e, 'bob2', 'data1', act);
})