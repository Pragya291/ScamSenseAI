import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_analytics_summary_and_trends():
    res_sum = client.get("/api/v1/analytics/summary")
    assert res_sum.status_code == 200
    data_sum = res_sum.json()
    assert "total_scans" in data_sum
    assert "scam_detection_rate" in data_sum

    res_tr = client.get("/api/v1/analytics/trends")
    assert res_tr.status_code == 200
    data_tr = res_tr.json()
    assert "trends" in data_tr
    assert len(data_tr["trends"]) > 0
