package org.engcia.Listener;

import org.kie.api.event.rule.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

public class CustomAgendaEventListener implements AgendaEventListener {

    private static final Logger LOG = LoggerFactory.getLogger(CustomAgendaEventListener.class);

    // List to keep track of the fired rules
    private final List<String> firedRules = new ArrayList<>();

    // Getter to retrieve fired rules
    public List<String> getFiredRules() {
        return firedRules;
    }

    @Override
    public void matchCreated(MatchCreatedEvent event) {
        // Optionally log match creation events
        LOG.debug("Rule match created: " + event.getMatch().getRule().getName());
    }

    @Override
    public void matchCancelled(MatchCancelledEvent event) {
        // Optionally log match cancellation events
        LOG.debug("Rule match cancelled: " + event.getMatch().getRule().getName());
    }

    @Override
    public void beforeMatchFired(BeforeMatchFiredEvent event) {
        // Optionally log before match fired
        LOG.debug("Before rule fired: " + event.getMatch().getRule().getName());
    }

    @Override
    public void afterMatchFired(AfterMatchFiredEvent event) {
        // Capture the fired rule
        String ruleName = event.getMatch().getRule().getName();
        firedRules.add(ruleName);
        LOG.info("Rule fired: " + ruleName);
    }

    @Override
    public void agendaGroupPopped(AgendaGroupPoppedEvent event) {
        // Optional: Handle agenda group popped
        LOG.debug("Agenda group popped: " + event.getAgendaGroup().getName());
    }

    @Override
    public void agendaGroupPushed(AgendaGroupPushedEvent event) {
        // Optional: Handle agenda group pushed
        LOG.debug("Agenda group pushed: " + event.getAgendaGroup().getName());
    }

    @Override
    public void beforeRuleFlowGroupActivated(RuleFlowGroupActivatedEvent event) {
        // Optional: Handle before rule flow group activated
        LOG.debug("Before rule flow group activated: " + event.getRuleFlowGroup().getName());
    }

    @Override
    public void afterRuleFlowGroupActivated(RuleFlowGroupActivatedEvent event) {
        // Optional: Handle after rule flow group activated
        LOG.debug("After rule flow group activated: " + event.getRuleFlowGroup().getName());
    }

    @Override
    public void beforeRuleFlowGroupDeactivated(RuleFlowGroupDeactivatedEvent event) {
        // Optional: Handle before rule flow group deactivated
        LOG.debug("Before rule flow group deactivated: " + event.getRuleFlowGroup().getName());
    }

    @Override
    public void afterRuleFlowGroupDeactivated(RuleFlowGroupDeactivatedEvent event) {
        // Optional: Handle after rule flow group deactivated
        LOG.debug("After rule flow group deactivated: " + event.getRuleFlowGroup().getName());
    }
}
