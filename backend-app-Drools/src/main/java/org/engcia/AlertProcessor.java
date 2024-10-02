package org.engcia;

import org.engcia.model.Evidences;
import org.engcia.model.Conclusion;

import org.kie.api.KieServices;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.rule.LiveQuery;
import org.kie.api.runtime.rule.Row;
import org.kie.api.runtime.rule.ViewChangedEventListener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AlertProcessor {
    static final Logger LOG = LoggerFactory.getLogger(AlertProcessor.class);

    public static final String run(Evidences evidences) {
        return runEngine(evidences);
    }

    private static String runEngine(Evidences evidences) {
        final String[] result = {""};
        try {
            // load up the knowledge base
            KieServices ks = KieServices.Factory.get();
            KieContainer kContainer = ks.getKieClasspathContainer();
            final KieSession kSession = kContainer.newKieSession("ksession-rules");

            // Query listener
            ViewChangedEventListener listener = new ViewChangedEventListener() {
                @Override
                public void rowDeleted(Row row) {}

                @Override
                public void rowInserted(Row row) {
                    Conclusion conclusion = (Conclusion) row.get("$conclusion");
                    LOG.info(">>>" + conclusion.toString());
                    result[0] = conclusion.toString();
                    // stop inference engine after as soon as got a conclusion
                    kSession.halt();
                }

                @Override
                public void rowUpdated(Row row) {}

            };
            LiveQuery query = kSession.openLiveQuery("Conclusions", null, listener);

            kSession.insert(evidences);
            kSession.fireAllRules();

            query.close();

        } catch (Throwable t) {
            t.printStackTrace();
        }
        return result[0];
    }
}
