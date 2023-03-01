var all_tree_data = {};

function searchTree(id)
{
     var input = prompt(msg_search_keyword, "");
     $("#" + id).jstree("search", input);
}
function reloadTreeData(obj,param, callback)
{
    if(obj.param) {
       if(typeof obj.param == "string") {
          obj.param = JSON.parse(obj.param);
       }
       if(param == null) {
          param = {};
       }
       param = $.extend(param, obj.param);
    }
    post(obj.url, param, function(data){

          var list = [];
          if(data instanceof Array)
          {
             list = data;
          }
          else
          {
             list=data.list;
          }
          var tree_data = makeTreeData(obj.id, list , obj.field_config);
          $("#" + obj.id).jstree("deselect_all");
          $("#" + obj.id).jstree(false).refresh();
          if(callback)
          {
             callback.call(obj, data);
          }

    });
}
function refreshSearchTreeData(obj,param)
{
   obj.field_config.search=true;
   var tree_data = reloadTreeData(obj, param, function(){
      obj.field_config.search=false;
   });


}
function getTreeData(obj)
{
    if(obj.param) {
       if(typeof obj.param == "string") {
          obj.param = JSON.parse(obj.param);
       }
    }
    post(obj.url, obj.param, function(data){

      var treeobj = $('#' + obj.id);
      var treeOption;
      if(obj.field_config)
      {
         var list = data;
         if(data instanceof Array)
          {
             list = data;
          }
          else
          {
             list=data.list;
          }
         makeTreeData(obj.id, list, obj.field_config);

         if(obj.field_config.onselect)
         {
            treeobj.on('changed.jstree', function (e, data) {
               try
               {
                  if(data.action == "deselect_all") return;
                  var i, j, r = [];
                   for(i = 0, j = data.selected.length; i < j; i++) {
                     r.push(data.instance.get_node(data.selected[i]).data);
                   }
                  obj.field_config.onselect.call(obj,r, data);
                  //treeobj.jstree().deselect_all(true);
               }
               catch(e)
               {

               }
            })
            treeobj.on('reload', function()
            {
               obj.reload();
            });
            treeobj.on('search', function( event, param){
               console.log(event,param);
               if(param && getParamSize(param)>0)
               {

                  refreshSearchTreeData(obj, param);
               }
               else
               {
                  obj.reload();
               }
            })
         }
         treeOption=   { 'core' : {
             'data' : function (node, cb) {
                 cb(all_tree_data[obj.id]);
               } }
         };
      }
      else
      {
         all_tree_data[obj.id] = data;
         treeOption=   {  'core' : {
             'data' : data
         } };
      }
      if(obj.dnd)
      {
         treeOption.core.check_callback=true;
         treeOption.plugins=["dnd"];
         treeobj.bind("move_node.jstree", function(e, data) {

            var moveData = { id : data.node.id, position: data.position, parent:data.parent=="#"? obj.field_config.root : data.parent }
            obj.field_config.onmove.call(obj, moveData);
            });
      }
      if(treeOption.plugins){
         treeOption.plugins.push("search");
      }else{
         treeOption.plugins = ["search"];
      }
      treeOption.search = {
         "case_sensitive": false,
            "show_only_matches": true
      }
      treeobj.jstree(treeOption).bind("loaded.jstree", function (event, data) {
         if(obj.callback) eval(obj.callback + '();');
      });
     });
}
function makeTreeData(id, list, field_config)
{
   var rootNode = null;
   var tree_data=[];
   list.forEach(function(data1,idx)
   {
      var rootNode1 = copyTreeField(tree_data, data1, field_config);
      if(rootNode1 != null)
      {
         rootNode = idx;
      }

   });

   if(rootNode != null)
   {
      tree_data.splice(rootNode, 1);
    }
   all_tree_data[id] = tree_data;
   return tree_data;
}
function getTreeDataLazy(obj)
{
   var treeobj = $('#' + obj.id);
   if(obj.field_config && obj.field_config.onselect)
   {
      treeobj.on('changed.jstree', function (e, data) {
         try
         {
            var i, j, r = [];
             for(i = 0, j = data.selected.length; i < j; i++) {
               r.push(data.instance.get_node(data.selected[i]).data);
             }
            obj.field_config.onselect.call(treeobj,r, obj);
         }
         catch(e)
         {

         }
      })
   }
   if(obj.url)
   {
      treeobj.jstree({ 'core' : {
        'data' : {
         'url' : obj.url,
          'data' : function(data)
          {
             if(data.list)
             {
                if(obj.field_config )
                {
                  var rootNode = null;
                  data.list.forEach(function(data1,idx)
                  {
                     var rootNode1 = copyTreeField(tree_data, data1, obj.field_config);
                     if(rootNode1 != null)
                     {
                        rootNode = idx;
                     }

                  });

                  if(rootNode != null)
                  {
                     tree_data.splice(rootNode, 1);
                  }
                  console.log(tree_data);
                  return tree_data;
                }
                else
                {
                   return data.list;
                }
             }
             else
             {
                return data;
             }
          },
          "check_callback" : obj.dnd,
         },
         "plugins" : ["dnd","search"]
      }});
   }


}

function expandAllTree(id)
{
   $("#" + id).jstree('open_all');
}
function closeAllTree(id)
{
   $("#" + id).jstree('close_all');
}
function copyTreeField(tree_data, data, field_config)
{
   var data1 = new Object();
   Object.keys(field_config).forEach(function(key,i){
      if(key != 'root' && key != 'onselect')
      {
         data1[key] = data[field_config[key]];
      }

   })
   data1.data  = data;
   tree_data.push(data1);
   if(data1.parent == field_config.root || field_config.search)
   {
      data1.parent = "#";
      data1.state = { opened : true };
   }
   if(!data1.icon)
   {
      data1.icon ="fa fa-circle-thin";
   }

   if(data1.id == field_config.root)
   {
      return data1;
   }
   else
   {
      return null;
   }
}
