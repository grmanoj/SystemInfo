

var systemInfo = chrome.experimental.systemInfo;


$("document").ready(function() {
  updateCPU();
  updateMemory();
  updateStorage();

  try {
    systemInfo.cpu.onUpdated.addListener(onCPUUsageChanged);
  } catch (ex) {
    console.log(ex);
  }
  $("#butRefreshCPU").click(updateCPU);
  $("#butRefreshMemory").click(updateMemory);
  $("#butRefreshStorage").click(updateStorage);
});


function updateCPU() {
  try {
    systemInfo.cpu.get(updateCPUInfo);
  } catch (ex) {
    console.log(ex);
  }
}

function updateMemory() {
  try {
    systemInfo.memory.get(updateMemoryInfo);
  } catch (ex) {
    $("#panelMemory").addClass("hidden");
    console.log(ex);
  }
}

function updateStorage() {
  try {
    systemInfo.storage.get(updateStorageInfo);
  } catch (ex) {
    console.log(ex);
  }
}

function updateCPUInfo(cpu) {
  console.log(cpu);
  $("#cpuArch").text(cpu.archName);
  $("#cpuModel").text(cpu.modelName);
  $("#cpuNumProcs").text(cpu.numOfProcessors);
  drawCPUUsageTable(cpu.numOfProcessors);
}

function updateMemoryInfo(memory) {
  console.log(memory);
  $("#memTotal").text(Math.round(memory.capacity / (1024*1024)) + " MB");
  $("#memAvail").text(Math.round(memory.availableCapacity / (1024*1024)) + " MB");
}

function updateStorageInfo(storage) {
  console.log(storage);
  var tbody = $("#storageUsage tbody");
  tbody.html("");
  for (var i = 0; i < storage.length; i++) {
    var drive = storage[i];
    var tr = $("<tr></tr>");
    tr.append($("<td></td>").text(drive.id));
    tr.append($("<td></td>").text(drive.type));
    tr.append($("<td></td>").text(Math.round(drive.capacity / (1024*1024))));
    tr.append($("<td></td>").text(Math.round(drive.availableCapacity / (1024*1024))));
    tbody.append(tr);
  }
}

function drawCPUUsageTable(processors) {
  var table = $("#cpuUsage");
  var thead_tr = $("<tr></tr>");
  thead_tr.append($("<th>Processor</th>"));
  for (var i = 0; i < processors; i++) {
    var col = $("<th></th>").text(i.toString());
    thead_tr.append(col);
  }
  thead_tr.append("<th>Total</th>");
  var thead = $("<thead></thead>").append(thead_tr);
  var tbody = $("<tbody></tbody>");
  var tbody_tr = $("<tr></tr>");
  tbody_tr.append($("<td>Usage History</td>"));
  for (var i = 0; i < processors; i++) {
    var col = $("<td></td>")
      .text("")
      .attr("id", "tCPU" + i.toString());
    tbody_tr.append(col);
  }
  tbody_tr.append($("<td></td>").attr("id", "tCPUt"));
  tbody.append(tbody_tr);
  table.html(thead);
  table.append(tbody);
}

function onStorageChanged(info) {
  console.log("onStorageChanged", info);
}

function onCPUUsageChanged(info) {
  updateCPUUsageCell("#tCPUt", Math.round(info.averageUsage));
  for (var i = 0; i < info.usagePerProcessor.length; i++) {
    updateCPUUsageCell("#tCPU" + i.toString(), Math.round(info.usagePerProcessor[i]));
  }
}


function updateCPUUsageCell(id, value) {
  var val = $("<span class='badge'></span>");
  if (value >= 50) {
    val.addClass("badge-important");
  } else if (value >= 20) {
    val.addClass("badge-warning");
  } else {
    val.addClass("badge-success");
  }
  val.text(value);
  $(id).html(val);
}
