// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-v3-or-Later

app.pages.Contacts = Backbone.View.extend({

  el: "#contacts_container",

  events: {
    "click #contacts_visibility_toggle" : "toggleContactVisibility",
    "click #chat_privilege_toggle" : "toggleChatPrivilege",
    "click #change_aspect_name" : "showAspectNameForm",
    "keyup #contact_list_search" : "searchContactList",
    "click .conversation_button": "showMessageModal"
  },

  initialize: function(opts) {
    this.visibilityToggle = $("#contacts_visibility_toggle i");
    this.chatToggle = $("#chat_privilege_toggle i");
    this.stream = opts.stream;
    this.stream.render();
    $("#people_stream.contacts .header i").tooltip({"placement": "bottom"});
    $(document).on("ajax:success", "form.edit_aspect", this.updateAspectName);
    app.events.on("aspect:create", function(){ window.location.reload() });

    this.aspectCreateView = new app.views.AspectCreate({ el: $("#newAspectContainer") });
    this.aspectCreateView.render();

    this.setupAspectSorting();
  },

  toggleChatPrivilege: function() {
    if (this.chatToggle.hasClass("enabled")) {
      this.chatToggle.tooltip("destroy")
                      .removeClass("enabled")
                      .removeAttr("data-original-title")
                      .attr("title", Diaspora.I18n.t("contacts.aspect_chat_is_not_enabled"))
                      .tooltip({"placement": "bottom"});
    } else {
      this.chatToggle.tooltip("destroy")
                      .addClass("enabled")
                      .removeAttr("data-original-title")
                      .attr("title", Diaspora.I18n.t("contacts.aspect_chat_is_enabled"))
                      .tooltip({"placement": "bottom"});
    }
  },

  toggleContactVisibility: function() {
    if (this.visibilityToggle.hasClass("entypo-lock-open")) {
      this.visibilityToggle.removeClass("entypo-lock-open")
                            .addClass("entypo-lock")
                            .tooltip("destroy")
                            .removeAttr("data-original-title")
                            .attr("title", Diaspora.I18n.t("contacts.aspect_list_is_not_visible"))
                            .tooltip({"placement": "bottom"});
    }
    else {
      this.visibilityToggle.removeClass("entypo-lock")
                            .addClass("entypo-lock-open")
                            .tooltip("destroy")
                            .removeAttr("data-original-title")
                            .attr("title", Diaspora.I18n.t("contacts.aspect_list_is_visible"))
                            .tooltip({"placement": "bottom"});
    }
  },

  showAspectNameForm: function() {
    $(".header > h3").hide();
    $(".header > #aspect_name_form").show();
  },

  updateAspectName: function(evt,data){
    $(".header #aspect_name").text(data['name']);
    $("#aspect_nav [data-aspect-id='"+data['id']+"'] .name").text(data['name']);
    $(".header > #aspect_name_form").hide();
    $(".header > h3").show();
  },

  searchContactList: function(e) {
    this.stream.search($(e.target).val());
  },

  showMessageModal: function(){
    app.helpers.showModal("#conversationModal");
  },

  setupAspectSorting: function() {
    $("#aspect_nav .list-group").sortable({
      items: "a.aspect[data-aspect-id]",
      update: function() {
        $("#aspect_nav .ui-sortable").addClass("syncing");
        var data = JSON.stringify({ ordered_aspect_ids: $(this).sortable("toArray", { attribute: "data-aspect-id" }) });
        $.ajax(Routes.orderAspects(),
          { type: "put", dataType: "text", contentType: "application/json", data: data })
          .done(function() { $("#aspect_nav .ui-sortable").removeClass("syncing"); });
      },
      revert: true,
      helper: "clone"
    });
  }
});
// @license-end
