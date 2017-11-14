"use strict";

var Console = require("libs/log")(module);
var config = require("config");
var Level = require("../level/level").Level;
var Bot = require("../objects/bot").Bot;
var cameraCulling = require("../objects/dynent").cameraCulling;
var Vector = require("../libs/vector").Vector;
var updateItem = require("../objects/item").updateItem;
var Weapon = require("../objects/weapon").Weapon;
var itemForEach = require("../objects/item").itemForEach;
var NickGenerator = require("../libs/nickGenerator").NickGenerator;
var gameplay = require("./gameplay").gameplay;
var GameEvent = require("../objects/event.js").GameEvent;
var EVENT = require("./global.js").constants.EVENT;

function Game(levelSizeClass, anotherparams) {

    var self = this;
    this.bots = [];
    this.bullets = [];
    this.droped = [];
    this.clients = [];
    this.events = [];
    this.start_time = 0;
    var current_id = 0;
    var current_bullet_id = 0;
    var client_id_for_table = 0;
    this.seed = seed;
    this.size_class = size_class;
    this.level = new Level(levelSizeCLass, anotherparams);
    var nickGenerator = new NickGenerator(3);

    var max_players = this.level.getMaxBots();

    //Bot functional
    function createBot (botNick, isBot){
        //player creation
        return bot;
    }
    function addBot(bot) {
        //bot adding
    }
    function deleteBot(bot) {
        // bot removing
    }
    function handleBots() {
        //handling bots' count
    }
    function updateBot() {
        //handling counts and raspawning bots
    }
    function isListnable() {

    }
    function isVisible() {
        //bot is in frame
    }

    //client service
    function sendFrame() {

    }
    function sendFrameToClient(client, frameParams) {
        //listen all event from all visible bots and sends frame to client
    }
    function dropHandler() {

    }
    function update() {

    }

    //game params
    this.start = function () {
        //creating start time and updating
    }
    this.stop = function () {
        //
    }
    this.emptySlotCout = function () {
        var count_users = 0;
        for (var i = 0; i < this.clients.length; i++)
            if (this.clients[i].bot)
                count_users++;

        return Math.max(0, max_players - count_users);
    }
    this.getFrameTime = function () {
        return frame_time;
    }
    this.getBulletId = function () {
        current_bullet_id++;
        //if max bullets count create new loop
        if(current_bullet_id>0xffff)
            current_bullet_id = 1;
        return current_bullet_id;
    }
    this.addUser = function (client, nickName){
        //connecting user
    }
    this.disconnectUser = function (client) {

    }
    this.setUserInputs = function (client, inputs) {

    }
    this.changeCamPos = function (client, chngcmd) {

    }
    this.spectator = function (client, nickName) {
        //findnig bot with nickName
    }
    this.onclose = function () {
        //i don't know
    }
}