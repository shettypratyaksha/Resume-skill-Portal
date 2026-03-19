CREATE OR REPLACE FUNCTION calculate_skill_score (
    p_skills NUMBER,
    p_certifications NUMBER,
    p_experience NUMBER
)
RETURN NUMBER
IS
    total_score NUMBER;
BEGIN
    total_score :=
        (p_skills * 10) +
        (p_certifications * 20) +
        (p_experience * 5);

    RETURN total_score;
END;
/
