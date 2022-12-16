# snsForNest

[NodeReact (https://github.com/networkbanjang/NODE_React_SNS)와 비교한 차이점]

자세한내용은 https://velog.io/@tmddud73/SNS-Nest-Migration-%EB%B3%80%EA%B2%BD%EC%A0%90 에있습니다.

1. JS에서 TS로 변경 (백엔드 프로젝트여서 프론트쪽은 ts,tsx 확장자로 바꾸기만 할 뿐 구체적인 ts 기능구현은 하지않았음)
2. Express의 구조를 NestJS의 구조에 맞게 변경(모듈,컨트롤러,서비스 등등)
3. Injectable 데코레이터를 이용해 Filter,Guard,interceptor등으로 세분화
4. 시퀄라이즈에서 TypeORM으로 변경
  - 트랜잭션,DB접근 최소화등의 로직 변경
  - 쿼리빌더를 사용해서 기존 SQL 쿼리문과 친숙한 환경으로 만듬
5. 스웨거 사용

실제 화면상에서에서 보여지는 내용은 (https://drive.google.com/file/d/1k-AGIOiFj649Me_mOwCfLeYZGnJQKuq-/view?usp=sharing)와 큰 차이가 없을것같아서 따로 작성하진않았습니다.
