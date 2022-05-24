# tstable
## todos:
fix webpack config 
move test server and change imports.. idk if theres a good way for lib developement wo constant rebuild... symlink, or just cloning in repo..

seperate demo?? gues it can be in here but idk about seperate tsconfig, if i put webpack.config in root i could start wp without "cd demo"

reorganize that shit again later, when figuring out about builds etc. probablhy make seperate cjs and es build...

remove git history if publish bc of test data with personal txids etc
## test server
### test server - start
```./server```
includes flask server that can be started from root with:
```flask run```

runs at: 
```http://localhost:5000/```

### test server - develop
run 